import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'produto',
  title: 'Produto',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome do Produto', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'nome' }, validation: Rule => Rule.required() }),
    defineField({ name: 'descricao', title: 'Descrição', type: 'text', rows: 4, validation: Rule => Rule.required() }),
    defineField({
      name: 'imagens',
      title: 'Imagens do Produto',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: Rule => Rule.min(1).error('Adicione pelo menos uma imagem')
    }),
    defineField({ name: 'imagemDestaque', title: 'Imagem de Destaque (homepage)', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'categoria',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'categoria' }],
      validation: Rule => Rule.required()
    }),
    defineField({ name: 'faixaPreco', title: 'Faixa de Preço (ex: A partir de R$ 49)', type: 'string' }),
    defineField({
      name: 'notasOlfativas',
      title: 'Notas Olfativas',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Ex: Lavanda, Baunilha, Sândalo'
    }),
    defineField({
      name: 'ambientesSugeridos',
      title: 'Ambientes Sugeridos',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Ex: Sala de estar, Escritório, Quarto'
    }),
    defineField({ name: 'durabilidade', title: 'Durabilidade', type: 'string', description: 'Ex: Até 60 dias' }),
    defineField({
      name: 'intensidade',
      title: 'Intensidade',
      type: 'string',
      options: { list: ['Suave', 'Moderada', 'Intensa'], layout: 'radio' }
    }),
    defineField({ name: 'destaque', title: 'Produto em Destaque na Homepage?', type: 'boolean', initialValue: false }),
    defineField({ name: 'novidade', title: 'Marcar como Novidade?', type: 'boolean', initialValue: false }),
    defineField({ name: 'ativo', title: 'Produto Ativo (visível no site)?', type: 'boolean', initialValue: true }),
    defineField({
      name: 'mensagemWhatsapp',
      title: 'Mensagem WhatsApp personalizada',
      type: 'string',
      description: 'Deixe vazio para usar a mensagem padrão do site'
    }),
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
    select: { title: 'nome', media: 'imagemDestaque', subtitle: 'faixaPreco' },
    prepare({ title, media, subtitle }) {
      return { title, media, subtitle: subtitle || 'Sem preço definido' }
    }
  }
})
