import type { Schema, Struct } from '@strapi/strapi';

export interface ProjectCustomProjectSection extends Struct.ComponentSchema {
  collectionName: 'custom_project_sections';
  info: {
    displayName: 'Custom Project Section';
    pluralName: 'custom-project-sections';
    singularName: 'custom-project-section';
  };
  options: {
    private: false;
  };
  attributes: {
    description: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    features: Schema.Attribute.Component<'project.feature', true>;
    gallery: Schema.Attribute.Media<'images', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface ProjectFeature extends Struct.ComponentSchema {
  collectionName: 'project_features';
  info: {
    displayName: 'Project Feature';
    pluralName: 'project-features';
    singularName: 'project-feature';
  };
  options: {
    private: false;
  };
  attributes: {
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface PropertyPropertyFeature extends Struct.ComponentSchema {
  collectionName: 'property_features';
  info: {
    displayName: 'Property Feature';
    pluralName: 'property-features';
    singularName: 'property-feature';
  };
  options: {
    private: false;
  };
  attributes: {
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'project.custom-project-section': ProjectCustomProjectSection;
      'project.feature': ProjectFeature;
      'property.property-feature': PropertyPropertyFeature;
    }
  }
}
