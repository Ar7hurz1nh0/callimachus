import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { ReactElement, useState } from "react";
import styles from "../styles/Scrap.module.css";

type Preview = [{ title: string, subtitle: string, content: string[], link: string }, boolean]

const Home: NextPage = () => {
  const [preview, setPreview] = useState([{ title: '', subtitle: '', content: [], link: ''}, false] as Preview);
  function LoadArticle(link: string): void {
    if (link === 'https://g1.globo.com/mt/mato-grosso/noticia/2022/02/14/marido-fica-revoltado-por-nao-receber-o-primeiro-pedaco-do-bolo-e-ameaca-aniversariante-e-convidados-em-mt.ghtml') {
      setPreview([{
        title: 'Marido fica revoltado por não receber o primeiro pedaço do bolo e ameaça aniversariante e convidados em MT',
        subtitle: 'Suspeito, de 34 anos, foi preso escondido atrás de uma árvore.',
        content: ['Um homem de 34 anos foi preso após ameaçar a mulher e os convidados dela por não ter recebido o primeiro pedaço de bolo durante uma festa de aniversário em casa, no Bairro Jardim Violetas, em Sinop, no norte do estado, neste domingo (13).', 'Segundo a tradição, a primeira fatia tirada de um bolo de aniversário deve ir para a pessoa considerada mais especial por quem está soprando as velinhas.', 'Segundo o relato da vítima, de 32 anos, à Polícia Militar, o primeiro pedaço do bolo cortado por ela não foi para o marido e o suspeito ficou revoltado por causa disso.', 'Conforme o boletim de ocorrência registrado pela PM, o homem passou a ameaçar a aniversariante e os convidados dela e, em seguida, se retirou da festa. Ele teria voltado para tentar invadir o local e agredir a mulher, mas foi impedido pelos convidados.', 'A polícia foi acionada e, durante buscas pelo bairro, encontrou o suspeito escondido atrás de uma árvore.', 'Ele foi detido e encaminhado à delegacia para prestar esclarecimentos.'],
        link: 'https://g1.globo.com/mt/mato-grosso/noticia/2022/02/14/marido-fica-revoltado-por-nao-receber-o-primeiro-pedaco-do-bolo-e-ameaca-aniversariante-e-convidados-em-mt.ghtml'
      }, true])
    }
    else setPreview([{ title: '', subtitle: '', content: [''], link }, false]);
  }
  function Form(): ReactElement {
    let link
    try {
      link = preview[0].link
    } catch {
      link = ''
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault()
      const formData = Object.fromEntries((new FormData(e.currentTarget)).entries())
      console.log(formData)
      LoadArticle(formData.link as string)
    }
    return (
      <form onSubmit={handleSubmit}>
        <input className={styles.search} type="text" name="link" placeholder="Link do artigo" autoFocus={true} defaultValue={link}/>
      </form>
    )
  }
  return (
  <div className={styles.container}>
    <Head>
      <title>Callimachus | Scrap</title>
      <meta name="description" content="Callimachus, biblioteca de artigos aberta; Salve um artigo para depois" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className={styles.main}>
      <h1 className={styles.title}>Colete um artigo</h1>
      <h2 className={styles.subtitle}>Adicione um artigo ao repertório</h2>

      <div className={styles.description}>
        <Form />
      </div>
      <div className={styles.grid}>
        { preview[1] ? (
          <div className={styles.preview}>
            <h3 className={styles.preview}>{preview[0].title}</h3>
            <h4 className={styles.preview}>{preview[0].subtitle}</h4>
            { preview[0].content.map((paragraph: string, index: number) => (
              <p className={styles.preview} key={index}>{paragraph}</p>
              ))
            }
          </div>
        ) : null}
      </div>
    </main>
  </div>)
}

export default Home