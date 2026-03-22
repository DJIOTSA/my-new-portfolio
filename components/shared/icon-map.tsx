import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Cloud,
  Code,
  Cog,
  Globe,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Target,
  Users,
  Database,
  Smartphone
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Brain,
  Cloud,
  Code,
  Cog,
  Globe,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Target,
  Users,
  Database,
  Smartphone
};

export function getIconComponent(name: string): LucideIcon {
  return iconMap[name] ?? Code;
}
