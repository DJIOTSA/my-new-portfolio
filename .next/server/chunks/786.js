exports.id=786,exports.ids=[786],exports.modules={13445:(a,b,c)=>{"use strict";c.d(b,{L:()=>g});var d=c(40610),e=c(953);let f=process.env.DATABASE_URL;function g(){if(!f)throw Error("DATABASE_URL is not configured.");return globalThis.__postgresClient||(globalThis.__postgresClient=(0,e.A)(f,{max:5,idle_timeout:20,prepare:!1,connect_timeout:5})),globalThis.__postgresClient}(0,d.setDefaultResultOrder)("ipv4first")},22222:(a,b,c)=>{"use strict";c.d(b,{tR:()=>E,Ht:()=>O,ky:()=>A,Mc:()=>H,jZ:()=>K,u2:()=>I,Qc:()=>M,lC:()=>w,t1:()=>y,Sk:()=>z,dh:()=>F,fQ:()=>C,te:()=>B,DN:()=>D,LG:()=>L,B:()=>J,Wj:()=>N,kN:()=>G});var d=c(88323),e=c(13445);async function f(){let a=(0,e.L)(),[b]=await a`select * from site_settings limit 1`;if(!b)throw Error("Site settings not found.");return{id:b.id,logoMediaId:b.logo_media_id,defaultOgImageId:b.default_og_image_id,contactEmail:b.contact_email,linkedinUrl:b.linkedin_url,xUrl:b.x_url,githubUrl:b.github_url,coursePlatformUrl:b.course_platform_url,translations:b.translations??{},createdAt:b.created_at,updatedAt:b.updated_at}}async function g(a){let b=(0,e.L)();await b`
    insert into site_settings (
      id, logo_media_id, default_og_image_id, contact_email, linkedin_url, x_url,
      github_url, course_platform_url, translations, created_at, updated_at
    ) values (
      ${a.id},
      ${a.logoMediaId},
      ${a.defaultOgImageId},
      ${a.contactEmail},
      ${a.linkedinUrl},
      ${a.xUrl},
      ${a.githubUrl},
      ${a.coursePlatformUrl},
      ${JSON.stringify(a.translations)}::jsonb,
      ${a.createdAt},
      ${a.updatedAt}
    )
    on conflict (id) do update
    set logo_media_id = excluded.logo_media_id,
        default_og_image_id = excluded.default_og_image_id,
        contact_email = excluded.contact_email,
        linkedin_url = excluded.linkedin_url,
        x_url = excluded.x_url,
        github_url = excluded.github_url,
        course_platform_url = excluded.course_platform_url,
        translations = excluded.translations,
        updated_at = excluded.updated_at
  `}async function h(){let a=(0,e.L)();return(await a`select * from blog_categories order by order_index asc`).map(a=>({id:a.id,parentId:a.parent_id,orderIndex:a.order_index,translations:a.translations??{},createdAt:a.created_at,updatedAt:a.updated_at}))}async function i(){let a=(0,e.L)();return(await a`select * from blog_tags order by created_at asc`).map(a=>({id:a.id,translations:a.translations??{},createdAt:a.created_at,updatedAt:a.updated_at}))}async function j(){let a=(0,e.L)();return(await a`select * from blog_authors order by created_at asc`).map(a=>({id:a.id,avatarMediaId:a.avatar_media_id,email:a.email,linkedinUrl:a.linkedin_url,xUrl:a.x_url,githubUrl:a.github_url,translations:a.translations??{},createdAt:a.created_at,updatedAt:a.updated_at}))}async function k(){let a=(0,e.L)();return(await a`select * from blog_posts order by coalesce(published_at, created_at) desc`).map(a=>({id:a.id,authorId:a.author_id,categoryId:a.category_id,status:a.status,featured:a.featured,publishedAt:a.published_at,scheduledAt:a.scheduled_at,coverMediaId:a.cover_media_id,ogImageMediaId:a.og_image_media_id,readingTime:a.reading_time,difficulty:a.difficulty,tags:a.tags,resources:a.resources,relatedPostIds:a.related_post_ids,socialPublishing:a.social_publishing,translations:a.translations??{},createdAt:a.created_at,updatedAt:a.updated_at}))}async function l(a){let b=(0,e.L)();await b`
    insert into blog_posts (
      id, author_id, category_id, status, featured, published_at, scheduled_at, cover_media_id,
      og_image_media_id, reading_time, difficulty, tags, resources, related_post_ids, social_publishing,
      translations, created_at, updated_at
    ) values (
      ${a.id}, ${a.authorId}, ${a.categoryId}, ${a.status}, ${a.featured}, ${a.publishedAt},
      ${a.scheduledAt}, ${a.coverMediaId}, ${a.ogImageMediaId}, ${a.readingTime}, ${a.difficulty},
      ${JSON.stringify(a.tags)}::jsonb, ${JSON.stringify(a.resources)}::jsonb, ${JSON.stringify(a.relatedPostIds)}::jsonb,
      ${JSON.stringify(a.socialPublishing)}::jsonb, ${JSON.stringify(a.translations)}::jsonb, ${a.createdAt}, ${a.updatedAt}
    )
    on conflict (id) do update
    set author_id = excluded.author_id,
        category_id = excluded.category_id,
        status = excluded.status,
        featured = excluded.featured,
        published_at = excluded.published_at,
        scheduled_at = excluded.scheduled_at,
        cover_media_id = excluded.cover_media_id,
        og_image_media_id = excluded.og_image_media_id,
        reading_time = excluded.reading_time,
        difficulty = excluded.difficulty,
        tags = excluded.tags,
        resources = excluded.resources,
        related_post_ids = excluded.related_post_ids,
        social_publishing = excluded.social_publishing,
        translations = excluded.translations,
        updated_at = excluded.updated_at
  `}async function m(a){let b=(0,e.L)();await b`
    insert into blog_categories (id, parent_id, order_index, translations, created_at, updated_at)
    values (${a.id}, ${a.parentId}, ${a.orderIndex}, ${JSON.stringify(a.translations)}::jsonb, ${a.createdAt}, ${a.updatedAt})
    on conflict (id) do update
    set parent_id = excluded.parent_id,
        order_index = excluded.order_index,
        translations = excluded.translations,
        updated_at = excluded.updated_at
  `}async function n(a){let b=(0,e.L)();await b`
    insert into blog_tags (id, translations, created_at, updated_at)
    values (${a.id}, ${JSON.stringify(a.translations)}::jsonb, ${a.createdAt}, ${a.updatedAt})
    on conflict (id) do update
    set translations = excluded.translations,
        updated_at = excluded.updated_at
  `}async function o(a){let b=(0,e.L)();await b`
    insert into contact_entries (id, type, name, email, company, subject, message, status, created_at, updated_at)
    values (${a.id}, ${a.type}, ${a.name}, ${a.email}, ${a.company}, ${a.subject}, ${a.message}, ${a.status}, ${a.createdAt}, ${a.updatedAt})
  `}async function p(){let a=(0,e.L)();return(await a`select * from contact_entries order by created_at desc`).map(a=>({id:a.id,type:a.type,name:a.name,email:a.email,company:a.company,subject:a.subject,message:a.message,status:a.status,createdAt:a.created_at,updatedAt:a.updated_at}))}async function q(a,b){let c=(0,e.L)();await c`
    update contact_entries
    set status = ${b},
        updated_at = ${new Date().toISOString()}
    where id = ${a}
  `}async function r(){let a=(0,e.L)();return(await a`select * from media_files order by created_at desc`).map(a=>({id:a.id,storageKey:a.storage_key,fileName:a.file_name,mimeType:a.mime_type,size:a.size,width:a.width,height:a.height,altTranslations:a.alt_translations??{},createdAt:a.created_at,updatedAt:a.updated_at}))}async function s(a){let b=(0,e.L)();await b`
    insert into media_files (
      id, storage_key, file_name, mime_type, size, width, height, alt_translations, created_at, updated_at
    ) values (
      ${a.id},
      ${a.storageKey},
      ${a.fileName},
      ${a.mimeType},
      ${a.size},
      ${a.width},
      ${a.height},
      ${JSON.stringify(a.altTranslations)}::jsonb,
      ${a.createdAt},
      ${a.updatedAt}
    )
    on conflict (id) do update
    set storage_key = excluded.storage_key,
        file_name = excluded.file_name,
        mime_type = excluded.mime_type,
        size = excluded.size,
        width = excluded.width,
        height = excluded.height,
        alt_translations = excluded.alt_translations,
        updated_at = excluded.updated_at
  `}async function t(){let a=(0,e.L)();return(await a`select * from social_publications order by created_at desc`).map(a=>({id:a.id,blogPostId:a.blog_post_id,languageCode:a.language_code,platform:a.platform,status:a.status,generatedText:a.generated_text,finalText:a.final_text,externalPostId:a.external_post_id,externalUrl:a.external_url,publishedAt:a.published_at,retryCount:a.retry_count,errorMessage:a.error_message,createdAt:a.created_at,updatedAt:a.updated_at}))}async function u(a){let b=(0,e.L)();await b`
    insert into social_publications (
      id, blog_post_id, language_code, platform, status, generated_text, final_text, external_post_id, external_url,
      published_at, retry_count, error_message, created_at, updated_at
    ) values (
      ${a.id}, ${a.blogPostId}, ${a.languageCode}, ${a.platform}, ${a.status},
      ${a.generatedText}, ${a.finalText}, ${a.externalPostId}, ${a.externalUrl},
      ${a.publishedAt}, ${a.retryCount}, ${a.errorMessage}, ${a.createdAt}, ${a.updatedAt}
    )
    on conflict (id) do update
    set status = excluded.status,
        generated_text = excluded.generated_text,
        final_text = excluded.final_text,
        external_post_id = excluded.external_post_id,
        external_url = excluded.external_url,
        published_at = excluded.published_at,
        retry_count = excluded.retry_count,
        error_message = excluded.error_message,
        updated_at = excluded.updated_at
  `}var v=c(34068);async function w(a,b){let{effectiveRequestedLanguage:c,requestedLanguage:e,defaultLanguage:f}=await (0,v.HC)(a),[g,l,m,n]=await Promise.all([k(),j(),h(),i()]),o=m.flatMap(a=>{let b=function(a,b,c){try{let e=(0,d.n)(a.translations,b,c);return{...a,name:e.value.name,slug:e.value.slug,description:e.value.description}}catch{return null}}(a,c,f);return b?[b]:[]}),p=n.flatMap(a=>{try{let b=(0,d.n)(a.translations,c,f);return[{...a,name:b.value.name,slug:b.value.slug}]}catch{return[]}}),q=g.filter(a=>"published"===a.status).flatMap(a=>{try{return[x(a,l,m,n,e,c,f)]}catch{return[]}}).filter(a=>{let c=!b?.categorySlug||a.category.slug===b.categorySlug,d=!b?.tagSlug||a.resolvedTags.some(a=>a.slug===b.tagSlug);return c&&d});return{posts:q,categories:o,tags:p,featuredPosts:q.filter(a=>a.featured)}}function x(a,b,c,e,f,g,h){let i=(0,d.n)(a.translations,g,h),j=b.find(b=>b.id===a.authorId),k=c.find(b=>b.id===a.categoryId);if(!j||!k)throw Error(`Blog post ${a.id} references missing author or category.`);let l=(0,d.n)(j.translations,g,h),m=(0,d.n)(k.translations,g,h),n=e.filter(b=>a.tags.includes(b.id)).flatMap(a=>{try{let b=(0,d.n)(a.translations,g,h);return[{...a,name:b.value.name,slug:b.value.slug}]}catch{return[]}});return{...a,requestedLanguage:f,effectiveLanguage:i.effectiveLanguage,isFallback:i.isFallback,...i.value,author:{...j,name:l.value.name,bio:l.value.bio},category:{...k,name:m.value.name,slug:m.value.slug,description:m.value.description},resolvedTags:n,relatedPosts:[]}}async function y(a,b){let{requestedLanguage:c,effectiveRequestedLanguage:e,defaultLanguage:f}=await (0,v.HC)(a),[g,l,m,n]=await Promise.all([k(),j(),h(),i()]),o=g.find(a=>{let c=a.translations??{},d=c[e]??c[f]??c.en??c.fr;return d?.slug===b&&"published"===a.status});if(!o)return null;let p=x(o,l,m,n,c,e,f);return p.relatedPosts=g.filter(a=>o.relatedPostIds.includes(a.id)).flatMap(a=>{try{let b=(0,d.n)(a.translations,e,f);return[{id:a.id,title:b.value.title,slug:b.value.slug,excerpt:b.value.excerpt}]}catch{return[]}}),p}async function z(a){return(await w(a)).featuredPosts}async function A(){let[a,b,c,d]=await Promise.all([k(),h(),i(),j()]);return{posts:a,categories:b,tags:c,authors:d}}async function B(a){await l(a)}async function C(a){await m(a)}async function D(a){await n(a)}async function E(a){await o(a)}async function F(){return p()}async function G(a,b){await q(a,b)}async function H(){let[a,b,c,d]=await Promise.all([k(),p(),(0,v.i5)(),f()]);return{totalPosts:a.length,publishedPosts:a.filter(a=>"published"===a.status).length,totalLeads:b.length,enabledLanguages:d.translations[c.code]?2:1}}async function I(){return f()}async function J(a){await g(a)}async function K(){return r()}async function L(a){await s(a)}async function M(){return t()}async function N(a){await u(a)}async function O(a,b,c){let e=(await k()).find(b=>b.id===a),f=(await (0,v.i5)()).code;if(!e)throw Error("Post not found.");let g=(0,d.n)(e.translations,c,f),h="linkedin"===b?`${g.value.socialShareTitle}

${g.value.excerpt}

${g.value.canonicalUrl}`:`${g.value.socialShareTitle} ${g.value.canonicalUrl}`,i={id:`social_${Date.now()}`,blogPostId:a,languageCode:c,platform:b,status:"ready",generatedText:h,finalText:h,externalPostId:null,externalUrl:null,publishedAt:null,retryCount:0,errorMessage:null,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};return await u(i),i}},32851:()=>{},34068:(a,b,c)=>{"use strict";c.d(b,{i5:()=>g,kG:()=>f,HC:()=>h,hM:()=>i});var d=c(13445);function e(a){return{id:a.id,code:a.code,name:a.name,nativeName:a.native_name,enabled:a.enabled,isDefault:a.is_default,sortOrder:a.sort_order,createdAt:a.created_at,updatedAt:a.updated_at}}async function f(){let a=(0,d.L)();return(await a`select * from languages order by sort_order asc`).map(e)}async function g(){let a=await f(),b=a.find(a=>a.isDefault);if(!b){if(a[0])return a[0];throw Error("No language records configured. Run `pnpm db:setup` first.")}return b}async function h(a){let b=await f(),c=b.find(a=>a.isDefault)?.code??"en",d="fr"===a?"fr":"en",e=b.find(a=>a.code===d&&a.enabled);return{requestedLanguage:d,effectiveRequestedLanguage:e?.code??c,defaultLanguage:c}}async function i(a){let b=(0,d.L)();for(let c of(await b`delete from languages`,a))await b`
      insert into languages (id, code, name, native_name, enabled, is_default, sort_order, created_at, updated_at)
      values (
        ${c.id},
        ${c.code},
        ${c.name},
        ${c.nativeName},
        ${c.enabled},
        ${c.isDefault},
        ${c.sortOrder},
        ${c.createdAt},
        ${c.updatedAt}
      )
    `}},56411:()=>{},88323:(a,b,c)=>{"use strict";function d(a,b,c){if(!a)throw Error("Entity is missing the translations object.");let d=a[b];if(d)return{value:d,effectiveLanguage:b,isFallback:!1};let e=a[c];if(!e){let b=function(a){if(!a)return null;for(let b of["en","fr"]){let c=a[b];if(c)return{language:b,value:c}}return null}(a);if(!b)throw Error("Entity is missing translations for all supported languages.");return{value:b.value,effectiveLanguage:b.language,isFallback:!0}}return{value:e,effectiveLanguage:c,isFallback:!0}}c.d(b,{n:()=>d})}};