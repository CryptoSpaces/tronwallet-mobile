const relativeTime = {
  pt: {
    future: 'em %s',
    past: '%s atrás',
    s: 'alguns segundos',
    ss: '%d segundos',
    m: 'um minuto',
    mm: '%d minutos',
    h: 'uma hora',
    hh: '%d horas',
    d: 'um dia',
    dd: '%d dias',
    M: 'um mês',
    MM: '%d meses',
    y: 'um ano',
    yy: '%d anos'
  }
}

export const getRelativeTime = (locale) => relativeTime[locale]
