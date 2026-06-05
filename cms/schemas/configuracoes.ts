import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'configuracoes',
  title: 'Configurações do Site',
  type: 'document',
  fields: [
    defineField({ name: 'heroTitulo', title: 'Título Principal (Hero)', type: 'string' }),
    defineField({ name: 'heroSubtitulo', title: 'Subtítulo (Hero)', type: 'text', rows: 2 }),
    defineField({ name: 'whatsappNumero', title: 'Número do WhatsApp', type: 'string', description: 'Somente números, com DDD. Ex: 47997152830' }),
    defineField({ name: 'whatsappMensagem', title: 'Mensagem padrão do WhatsApp', type: 'string' }),
    defineField({ name: 'email', title: 'E-mail de contato', type: 'string' }),
    defineField({ name: 'instagramUrl', title: 'URL do Instagram', type: 'url' }),
    defineField({ name: 'cnpj', title: 'CNPJ', type: 'string' }),
    defineField({ name: 'razaoSocial', title: 'Razão Social', type: 'string' }),
    defineField({ name: 'endereco', title: 'Endereço', type: 'string' }),
    defineField({ name: 'rodapeTexto', title: 'Texto extra no rodapé', type: 'string' }),
  ],
  preview: { prepare: () => ({ title: 'Configurações do Site' }) }
})
