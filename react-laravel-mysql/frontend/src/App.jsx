import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [config, setConfig] = useState({
    title: '',
    subTitle: 'Fetching title from API...'
  })

  useEffect(() => {
    fetch('http://localhost:8000/api/config')
      .then(response => {
        response.json()
                .then(data => {
                  setConfig(data)
                })
      })
  }, []);

  return (
    <>
      <div>
        <img
          width="210"
          src="/docker.svg" alt="The Docker logo" title="The Docker logo"
          />
      </div>

      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://laravel.com" target="_blank">
          <img src="/laravel.svg" className="logo" alt="Laravel logo" />
        </a>
        <a href="https://www.mysql.com" target="_blank">
          <img src="/mysql.png" className="logo" alt="MySQL logo" />
        </a>
      </div>
      <h1>{ config.title }</h1>
      <h2>{ config.subTitle }</h2>

      <p className="read-the-docs">
        Docker compose sample of React (Vite) application with Laravel backend and MySQL Database.
      </p>
    </>
  )
}

export default App
