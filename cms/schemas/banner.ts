import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'banner',
  title: 'Banner / Promoção',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', title: 'Título do Banner', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'subtitulo', title: 'Subtítulo', type: 'string' }),
    defineField({ name: 'imagem', title: 'Imagem', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'ctaTexto', title: 'Texto do Botão', type: 'string', description: 'Ex: Ver promoção' }),
    defineField({ name: 'ctaLink', title: 'Link do Botão', type: 'url' }),
    defineField({ name: 'inicio', title: 'Data de início', type: 'datetime' }),
    defineField({ name: 'fim', title: 'Data de término', type: 'datetime' }),
    defineField({ name: 'ativo', title: 'Banner Ativo?', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'titulo', media: 'imagem', subtitle: 'ativo' },
    prepare({ title, media, subtitle }) {
      return { title, media, subtitle: subtitle ? '✅ Ativo' : '⏸ Inativo' }
    }
  }
})
