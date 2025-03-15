
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
}

const SEO = ({
  title = 'AI Makers - Tutoriales y Herramientas de IA',
  description = 'Aprende a utilizar herramientas de IA con nuestros tutoriales, prompts y recursos para creadores digitales.',
  image = '/og-image.png',
  type = 'website'
}: SEOProps) => {
  const location = useLocation();
  const url = `https://aimakers.app${location.pathname}`;

  useEffect(() => {
    // Update the document title
    document.title = title;
    
    // Update meta tags
    const metaTags = [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { property: 'twitter:title', content: title },
      { property: 'twitter:description', content: description },
      { property: 'twitter:image', content: image },
      { property: 'twitter:url', content: url }
    ];
    
    // Update existing meta tags or create new ones
    metaTags.forEach(({ name, property, content }) => {
      // Try to find an existing tag
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      const existingTag = document.querySelector(selector) as HTMLMetaElement;
      
      if (existingTag) {
        // Update existing tag
        existingTag.content = content;
      } else {
        // Create a new tag
        const newTag = document.createElement('meta');
        if (name) newTag.name = name;
        if (property) newTag.setAttribute('property', property);
        newTag.content = content;
        document.head.appendChild(newTag);
      }
    });
    
    // Update canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalElement) {
      canonicalElement.href = url;
    } else {
      canonicalElement = document.createElement('link');
      canonicalElement.rel = 'canonical';
      canonicalElement.href = url;
      document.head.appendChild(canonicalElement);
    }
    
    // Clean up function to remove any tags we added when the component unmounts
    return () => {
      // We don't remove tags on unmount as it could affect other components,
      // but we would if this was a complete SPA with controlled routing
    };
  }, [title, description, image, url, type]);
  
  // This component doesn't render anything
  return null;
};

export default SEO;
