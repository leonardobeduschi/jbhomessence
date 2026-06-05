import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'categoria',
  title: 'Categoria',
  type: 'document',
  fields: [
    defineField({ name: 'nome', title: 'Nome da Categoria', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'nome' }, validation: Rule => Rule.required() }),
    defineField({ name: 'descricao', title: 'Descrição', type: 'text', rows: 2 }),
    defineField({ name: 'ordem', title: 'Ordem de exibição', type: 'number' }),
  ],
  preview: { select: { title: 'nome' } }
})
