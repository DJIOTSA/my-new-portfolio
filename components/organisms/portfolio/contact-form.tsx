"use client";

import type { FormEvent } from "react";
import { useState } from "react";

interface ContactFormProps {
  labels: {
    formTypeLabel: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
  };
}

export function ContactForm({ labels }: ContactFormProps) {
  const [formData, setFormData] = useState({
    type: "contact",
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setFormData({
        type: "contact",
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
          {labels.formTypeLabel}
        </label>
        <select
          id="type"
          value={formData.type}
          onChange={(event) => setFormData((current) => ({ ...current, type: event.target.value }))}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="contact">Contact</option>
          <option value="project-inquiry">Project Inquiry</option>
          <option value="consultation">Consultation</option>
        </select>
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          {labels.nameLabel}
        </label>
        <input
          id="name"
          value={formData.name}
          onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={labels.namePlaceholder}
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          {labels.emailLabel}
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={labels.emailPlaceholder}
        />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
          {labels.subjectLabel}
        </label>
        <input
          id="subject"
          value={formData.subject}
          onChange={(event) => setFormData((current) => ({ ...current, subject: event.target.value }))}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={labels.subjectPlaceholder}
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
          {labels.messageLabel}
        </label>
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={labels.messagePlaceholder}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-70"
      >
        {isSubmitting ? "Sending..." : labels.submitLabel}
      </button>
    </form>
  );
}
