'use client'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import PageScoreTable from '@/app/components/PageScoreTable'
import PageScoreTableAll from '@/app/components/PageScoreTableAll'
import { SetStateAction, useState } from 'react'
import { Suspense } from 'react'
import Loading from '@/app/components/Loading'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2'
import { faker } from '@faker-js/faker'
import PageSelect from './components/PageSelect'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  interface pageList {
    name: string,
    url: string,
    score: number,
    date: string
  }

  const [isError, setIsError] = useState<boolean>(false)
  
  const [pageList, setPageList] = useState<pageList[]>([])
  const [selectedPage, setSelectedPage] = useState<pageList[]>([])

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const getScore = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}pagespeedInsights?url=${url}`, {
      cache: "no-store",
    })
    console.log(res)
    if(res.ok) {
      const data =await res.json()
      const score = data.score
      setPageList((pageList) => [...pageList, {name, score, url, date: new Date().toLocaleString()}])
      setName('')
      setUrl('')
    } else {
      setIsError(true)
    }
  }

  const getScoreAgain = async (existedUrl: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}pagespeedInsights?url=${existedUrl}`, {
      cache: "no-store",
    })
    console.log(res)
    if(res.ok) {
      const data =await res.json()
      const score = data.score
      setPageList((pageList) => {
        const updatedPageList = pageList.map((page) => {
          if (page.url === existedUrl) {
            return { ...page, score, date: new Date().toLocaleString() }
          } else {
            return page
          }
        })
        return updatedPageList
      })
    }
  }

  const handlePageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pageName = e.target.value
    const selected = pageList.find(page => page.name === pageName)
    console.log(selected)
    if (selected) {
      console.log(selectedPage)
      setSelectedPage([selected])
    }
    // if (pageName === 'All') {
    //   setSelectedPage(pageList)
    // } else {
    //   const selected = pageList.find(page => page.name === pageName)
    //   if (selected) {
    //     setSelectedPage([selected])
    //   }
    // }
  }

  const handleNameChange = (event: { target: { value: string } }) => {
    setName(event.target.value);
  }

  const handleUrlChange = (event: { target: { value: string } }) => {
    const protocolRegex = new RegExp('/^https?:\/\//')
    const urlRegex = new RegExp('/^https?:\/\/xn--[\w-][2,1988]\./')
    const inputValue: string = event.target.value
    
    if(!protocolRegex.test(inputValue) && !urlRegex.test(inputValue)) {
      setUrl('https://' + inputValue.replace(/^https?:\/\//, ''))
    } else {
      setUrl(inputValue)
    }
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '各ページのスコア',
      },
    },
  }

  console.log(process.env.NEXT_PUBLIC_URL)

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
  const graphData = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  return (
    <div className='h-screen md:flex font-primary'>
      <div className='md:w-1/3 justify-center p-8 items-center bg-white'>
        <p className='text-lg mb-3 font-bold font-primary'>追加で計測をしたいサイトを登録してください</p>
        <form className='w-full mx-auto'>
          <div className='border-2 py-2 px-3 rounded-2xl mb-4'>
            <input className='pl-2 outline-none border-none' type='text' name='' placeholder='サイト名' value={name} onChange={handleNameChange} />
          </div>
          <div className='border-2 py-2 px-3 rounded-2xl mb-4'>
            <input className='pl-2 outline-none border-none' type='text' name='' placeholder='URL' value={url} onChange={handleUrlChange} />
          </div>
          <button type='button' className='w-1/3 bg-gray-900 mt-4 py-2 rounded-2xl
          text-white font-semibold mb-2 active:bg-gray-500 hover:scale-[0.95] active:scale-[1] transition focus:outline-none
          focus:shadow-outline duration-150 ease-in-out' onClick={getScore}>登録</button>
          {isError && <p className='text-red-500'>無効なURL</p>}
        </form>
      </div>

      <div className='md:w-2/3 justify-center py-10 items-center bg-gray-100'>
        <div className='w-[90%] mx-auto'>
          <p className='text-lg text-center font-bold m-5'>計測対象ページ</p>
          <PageSelect selectedPages={pageList} handlePageSelect={handlePageSelect}>
          {selectedPage && (
            <Suspense fallback={<Loading />}>
              {selectedPage.map((page, index) => (
                <PageScoreTable
                  key={index}
                  name={page.name}
                  url={page.url}
                  score={page.score}
                  date={page.date}
                  onClick={() => getScoreAgain(page.url)}
                />
              ))}
            </Suspense>
            )}
            <PageScoreTableAll
              pageList={pageList}  
              />
          </PageSelect>

          <h3 className='text-2xl font-bold mx-auto w-full mt-8'>線グラフ</h3>
          <div className='w-[60%] mx-auto'>
            <Bar
              height={100}
              width={100}
              data={graphData}
              options={options}
              id='chart-key'
            />
          </div>
        </div>
      </div>
    </div>

  )
}
