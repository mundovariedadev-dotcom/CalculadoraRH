# Calculador-de-horas-extras

Uma calculadora para calcular horas trabalhadas e separar as horas extras, acumulando múltiplos dias e calculando totais no final, com suporte para diferentes turno, baseada em regras específicas, com interface web em HTML, CSS e JavaScript.

## Funcionalidades

- Adicione múltiplos dias trabalhados com data, horas trabalhadas, turno (1º ou 2º) e se é feriado
- Calcula automaticamente horas normais conforme o turno e horas extras
- Mostra tabela com detalhes por dia
- Calcula totais: horas normais, horas extras, valores
- Permite exportar a tabela e os totais como arquivo CSV
- Regras de cálculo:
  - **1º Turno**: Jornada de 40 horas/semana = 8,80h/dia (08:00-12:00 e 13:12-18:00)
  - **2º Turno**: Jornada de 39,60 horas/semana = 7,92h/dia
  - Horas extras sempre 50% a mais, independente da quantidade
  - Em feriados: paga 100% adicional pelas horas trabalhadas
  - Jornada mensal: 220 horas
- Interface web responsiva e fácil de usar

## Como usar

1. Abra o arquivo `index.html` em um navegador web.
2. Digite o salário por hora (fixo para todos os dias).
3. Selecione o turno (1º ou 2º).
4. Adicione dias: selecione a data, digite as horas trabalhadas, marque se é feriado, clique em "Adicionar Dia".
5. A tabela será atualizada automaticamente com os cálculos por dia.
6. Veja os totais no final.
7. Clique em "Baixar tabela com totais" para salvar os dados em CSV.

## Arquivos

- `index.html`: Página principal da aplicação
- `styles.css`: Estilos CSS para a interface
- `script.js`: Lógica JavaScript para os cálculos e gerenciamento de dias
- `main.py`: Versão original em Python (CLI)
- `requirements.txt`: Dependências (nenhuma)

## Exemplo

Para um salário de R$ 15,00/hora:
- **1º Turno - Dia normal**: 10 horas → 8,80 normais, 1,20 extras (R$ 27,00)
- **2º Turno - Dia normal**: 8,5 horas → 7,92 normais, 0,58 extras (R$ 13,05)
- **Dia feriado**: 8,80 horas → R$ 264,00 (100% adicional, qualquer turno)
- **Totais**: conforme adicionado

## Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, etc.)