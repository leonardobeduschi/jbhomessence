import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'depoimento',
  title: 'Depoimento',
  type: 'document',
  fields: [
    defineField({ name: 'nomeCliente', title: 'Nome do Cliente', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'cidade', title: 'Cidade e Estado', type: 'string', description: 'Ex: São Paulo, SP' }),
    defineField({
      name: 'tipo',
      title: 'Tipo de Cliente',
      type: 'string',
      options: { list: ['Residencial', 'Clínica / Consultório', 'Hotel / Pousada', 'Escritório', 'Loja / Comércio', 'Condomínio'], layout: 'radio' }
    }),
    defineField({ name: 'texto', title: 'Depoimento', type: 'text', rows: 4, validation: Rule => Rule.required() }),
    defineField({
      name: 'estrelas',
      title: 'Avaliação (1 a 5 estrelas)',
      type: 'number',
      options: { list: [1, 2, 3, 4, 5] },
      initialValue: 5
    }),
    defineField({ name: 'foto', title: 'Foto do Cliente (opcional)', type: 'image' }),
    defineField({ name: 'ativo', title: 'Exibir no site?', type: 'boolean', initialValue: true }),
    defineField({ name: 'ordem', title: 'Ordem de exibição', type: 'number' }),
  ],
  preview: {
    select: { title: 'nomeCliente', subtitle: 'tipo', media: 'foto' },
    prepare({ title, subtitle, media }) {
      return { title, media, subtitle: subtitle || 'Sem categoria' }
    }
  }
})
