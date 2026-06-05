import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'jb-home-essence',
  title: 'JB Home Essence — CMS',
  projectId: 'g210jgg5',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Conteúdo')
          .items([
            S.listItem().title('⚙️ Configurações do Site').child(
              S.document().schemaType('configuracoes').documentId('configuracoes')
            ),
            S.divider(),
            S.documentTypeListItem('produto').title('🌿 Produtos'),
            S.documentTypeListItem('categoria').title('📂 Categorias'),
            S.divider(),
            S.documentTypeListItem('post').title('📝 Posts do Blog'),
            S.divider(),
            S.documentTypeListItem('depoimento').title('⭐ Depoimentos'),
            S.documentTypeListItem('banner').title('🎯 Banners / Promoções'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
