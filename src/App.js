import './App.css';
import { useState, useEffect } from 'react'
import puppeteer from 'puppeteer';

async function getArticlesScript(lastArticle = "") {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://developers.googleblog.com/');

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

 // Get the last Article publish to see if it's a new one
    const lastArticlePublished = await page.evaluate(() => {
        const articles = document.querySelectorAll('.dgc-card');
        const lastArticle = articles[0];
        const title = lastArticle.querySelector('a').innerText;
        return title;
    });

    await browser.close();

    if (lastArticlePublished !== lastArticle) {
        return lastArticlePublished;
    } else {
        return getLastFiveArticles();
    }

};

const getLastFiveArticles = async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto('https://developers.googleblog.com/');

    // Set screen size
    await page.setViewport({width: 1080, height: 1024});

    // Get the last Article publish to see if it's a new one
    const lastFiveArticles = await page.evaluate(() => {
        const articles = document.querySelectorAll('.dgc-card');
        const lastFiveArticles = [];
        for (let i = 0; i < 5; i++) {
            const article = articles[i];
            const title = article.querySelector('a').innerText;
            lastFiveArticles.push(title);
        }
        return lastFiveArticles;
    });

    await browser.close();
    return lastFiveArticles;
}

function App() {
  // I want to trigger a function every 5 minutes
  // I want to store the result of this function in a state

  const [articles, setArticles] = useState([])

   useEffect(() => {
     const interval = setInterval(() => {
      getArticlesScript(articles.length !== 0 ? articles[articles.length - 1] : "").then((article) => {
          setArticles([...articles, article])
        })
      }, 300000);
      return () => clearInterval(interval);
    }, [articles]);

  return (
    <div className="App">
      <h1>Toutes les 5mins, je récupère les derniers articles publiés par la documentation google</h1>

      <ul>
        {articles.map((article, index) => (
          <li key={index}>{article}</li>
        ))
        }
      </ul>
    </div>
  );
}

export default App;
