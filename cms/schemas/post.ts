import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post do Blog',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'titulo' }, validation: Rule => Rule.required() }),
    defineField({ name: 'imagemCapa', title: 'Imagem de Capa', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'resumo', title: 'Resumo', type: 'text', rows: 3, validation: Rule => Rule.required() }),
    defineField({
      name: 'conteudo',
      title: 'Conteúdo',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } }
      ]
    }),
    defineField({ name: 'dataPublicacao', title: 'Data de Publicação', type: 'date', validation: Rule => Rule.required() }),
    defineField({
      name: 'categoria',
      title: 'Categoria do Post',
      type: 'string',
      options: {
        list: ['Guia de Aromatização', 'Marketing Sensorial', 'Famílias Olfativas', 'Bem-estar', 'Presentes', 'Aromatização Profissional', 'Onde Comprar']
      }
    }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'publicado', title: 'Publicado?', type: 'boolean', initialValue: false }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 2 },
      ]
    }),
  ],
  preview: {
    select: { title: 'titulo', media: 'imagemCapa', subtitle: 'dataPublicacao' }
  }
})
