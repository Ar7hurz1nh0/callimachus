import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  function Encode(s: string): string {
    if (typeof document === 'undefined') return ''
    var el = document.createElement("div");
    el.innerText = el.textContent = s;
    return el.innerHTML;
  }
  function Reduce(str: string, max: number = Infinity): string {
    if (str.length > max) {
      str = str.substring(0, max);
      str = str.substring(0, Math.min(str.length, str.lastIndexOf(" ")));
      str = str + "...";
    }
    return str;
  }
  const articles = [
    [
      "Caso Prevent Senior: investigações dependem de novos depoimentos, laudos e documentos para serem concluídas neste ano",
      "Empresa é investigada por usar de forma experimental medicamentos do chamado 'kit Covid'. Ministério Público Estadual, Federal, do Trabalho e polícia apuram denúncias contra operadora, além da CPI aberta na Câmara Municipal de SP.",
      "https://g1.globo.com/sp/sao-paulo/noticia/2022/02/10/caso-prevent-senior-investigacoes-dependem-de-novos-depoimentos-laudos-e-documentos-para-serem-concluidas-neste-ano.ghtml"
    ], [
      "Foragido, Carlinhos Mendigo é procurado pela polícia em São Paulo e na Bahia",
      "Artista que trabalhou no Pânico na TV e na Jovem Pan deve mais de R$ 90 mil de pensão alimentícia para filho que teve com ex-bailarina Aline Hauck. Polícia Civil de São Paulo o procura desde quarta (9) e vai acionar polícia da Bahia por suspeita de que ele possa ter se escondido lá.",
      "https://g1.globo.com/sp/sao-paulo/noticia/2022/02/10/foragido-carlinhos-mendigo-e-procurado-pela-policia-em-sao-paulo-e-na-bahia.ghtml"
    ], [
      "Justiça Federal condena 65 pessoas em operação contra contrabando aéreo de anabolizantes e eletrônicos",
      "Entre os condenados estão agentes da PF e da Polícia Civil de SP e líderes de quatro organizações criminosas, que agiam no Paraguai, no Paraná e em mais dois estados; quadrilha movimentava R$ 3 bilhões em mercadorias por ano.",
      "https://g1.globo.com/pr/norte-noroeste/noticia/2022/02/10/justica-federal-condena-65-pessoas-em-operacao-contra-contrabando-aereo-de-anabolizantes-e-eletronicos.ghtml"
    ], [
      "Monark e responsáveis por podcast podem pagar indenização e ser presos por apologia do nazismo, diz MP de SP; Adrilles é investigado",
      "Ministério Público investiga influencer e Flow Poadcast na esfera cível por dano moral coletivo à sociedade e na esfera criminal por divulgar conteúdo nazista durante programa. Monark defendeu criação de partido nazista e direito de ser 'antijudeu'. Depois alegou estar 'bêbado'.",
      "https://g1.globo.com/sp/sao-paulo/noticia/2022/02/10/monark-e-responsaveis-por-podcast-podem-pagar-indenizacao-e-ate-serem-presos-por-apologia-do-nazismo-na-internet-diz-mp-de-sp.ghtml#G1-POST-TOP-12H-item-sel-6,top,ab4e2950-1e3b-4083-9bc8-4d8a62afa094"
    ], [
      "Vacinação mudou o perfil de internados e mortos pela Covid-19 no Brasil, aponta estudo",
      "Pesquisadores da Famerp constataram que a vacina conseguiu 'equilibrar' outros fatores de risco, como problemas de coração, neurológicos e diabetes. Única exceção foi a doença renal, que continuou aumentando risco mesmo entre vacinados.",
      "https://g1.globo.com/saude/coronavirus/noticia/2022/02/10/vacinacao-mudou-o-perfil-de-internados-e-mortos-pela-covid-19-no-brasil-aponta-estudo.ghtml"
    ], [
      "Ex-padrasto que virou réu por morte de jovem tinha senha para monitorar localização da vítima com app espião",
      "Anna Carolina Pascuin Nicoletti foi encontrada morta dentro do próprio apartamento, em Sorocaba (SP). Homem virou réu pelo homicídio, mas teve a prisão preventiva negada e foi solto.",
      "https://g1.globo.com/sp/sorocaba-jundiai/noticia/2022/02/10/ex-padrasto-que-virou-reu-por-morte-de-jovem-tinha-senha-para-monitorar-localizacao-da-vitima-com-app-espiao.ghtml"
    ]
  ]
  const subtitle: [string, string] = ["Ανοίξτε τη βιβλιοθήκη άρθρων", "Biblioteca de artigos aberta"]
  return (
    <div className={styles.container}>
      <Head>
        <title>Callimachus</title>
        <meta name="description" content="Callimachus, biblioteca de artigos aberta" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Bem vindo ao <Link href="/"><a>callima.co</a></Link>
        </h1>
        <h2 className={styles.subtitle}>{ subtitle[0] }</h2>

        <p className={styles.description}>
          <input className={styles.search} placeholder="Pesquise" />
          ou <Link href="/scrap"><a><code className={styles.scrap}>colete</code></a></Link>
          algum artigo
        </p>

        <div className={styles.grid}>
          {articles.map(([title, subtitle, link]) => (
          <a href={link}
            className={styles.card}
            rel="noopener noreferrer"
            key={link}
          >
            <h2>{Encode(Reduce(title, 60))} &rarr;</h2>
            <p>{Encode(Reduce(subtitle, 180))}</p>
          </a>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
