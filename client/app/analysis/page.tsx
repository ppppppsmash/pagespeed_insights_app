'use client'
import { NextPage } from 'next'
import AnalysisInput from '@/components/Input/AnalysisInput'
import AnalysisButton from '@/components/Button/AnalysisButton'
import { useState } from 'react'
import { ApiResultType } from '@/type'
import { urlValidate } from '@/lib/urlValidate'
import { SlScreenSmartphone } from 'react-icons/sl'
import { RiComputerLine } from 'react-icons/ri'
import Loading from '@/components/Loading'

interface Props extends ApiResultType {}

const page: NextPage<Props> = (props): JSX.Element => {
  const [url, setUrl] = useState('')

  const [results, setResults] = useState<Props>()
  const [mobileResults, setMobileResults] = useState<Props>()

  const [selectedDevice, setSelectedDevice] = useState<'mobile' | 'desktop'>('mobile')

  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const [pageList, setPageList] = useState<Props[]>([])
  const [mobilePageList, setMobilePageList] = useState<Props[]>([])

  const date = new Date().toLocaleString()

  const getChangeUrl = ({target}: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(target.value)
  }

  const fetchPsiData = async (url: string, device: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}pageSpeedInsights?url=${urlValidate(url)}&strategy=${device}`, {
      cache: 'no-store'
    })
    return res
  }

  const getPsiInfo = async() => {
    setLoading(true)
    const res = await fetchPsiData(url, selectedDevice)

    if (res.ok) {
      const data = await res.json()
      const { result } = data
      const { lighthouseResult } = result
      const { categories } = lighthouseResult
      const { performance } = categories
      const score = performance.score * 100

      const { audits } = lighthouseResult
      const metrics = {
        lcp: audits['largest-contentful-paint'],
        fid: audits['first-input-delay'],
        cls: audits['cumulative-layout-shift'],
        fcp: audits['first-contentful-paint'],
        tbt: audits['total-blocking-time'],
        si: audits['speed-index'],
        fci: audits['first-cpu-idle'],
        eil: audits['estimated-input-latency'],
        fmp: audits['first-meaningful-paint'],
        tti: audits['interactive']
      }

      const psiData = {
        url,
        date,
        score,
        fcp: metrics.fcp.displayValue,
        lcp: metrics.lcp.numericValue
      }

      selectedDevice === 'desktop'
        ? setResults(prevState => ({ ...prevState, ...psiData }))
        : setMobileResults(prevState => ({ ...prevState, ...psiData }))
      selectedDevice === 'desktop'
        ? setPageList(prevState => [...prevState, psiData])
        : setMobilePageList(prevState => [...prevState, psiData])

       setVisible(true)
       setLoading(false)
    }
  }

  const handleDeviceSelection = (device: 'mobile' | 'desktop') => {
    setSelectedDevice(device);
  };

  return (
    <div className='w-[80%] mx-auto'>
      <section className='mb-10'>
        <div className='text-center mb-2'>
          <h2 className='text-2xl font-semibold'>計測対象URL</h2>
        </div>
        <div className='flex items-center justify-center space-x-3'>
          <div className='w-full'>
            <AnalysisInput
              placeholder='https://example.com'
              handleChange={getChangeUrl}
            />
          </div>
          <div className='w-2/12'>
            <AnalysisButton
              label='分析'
              handleScore={getPsiInfo}
            />
          </div>
        </div>
      </section>

      <section>
        <div
            className='w-[250px] flex items-center justify-between mx-auto'
          >
            <div
              className={`flex items-center rounded border border-gray-300 p-2
              cursor-pointer space-x-2 hover:text-white hover:bg-gray-900
              ${selectedDevice === 'mobile' ? 'text-white bg-gray-900' : ''}`}
              onClick={() => handleDeviceSelection('mobile')}
            >
              <SlScreenSmartphone size={26} />
              <p className='text-sm'>携帯電話</p>
            </div>
            <div
              className={`flex items-center rounded border border-gray-300 p-2
              cursor-pointer space-x-2 hover:text-white hover:bg-gray-900
              ${selectedDevice === 'desktop' ? 'text-white bg-gray-900' : ''}`}
              onClick={() => handleDeviceSelection('desktop')}
            >
              <RiComputerLine size={26} />
              <p className='text-sm'>デスクトップ</p>
            </div>
          </div>
          <div>
          {/* loading */}
          { loading && <Loading /> }
          {/* mobile */}
          { !loading && mobileResults && selectedDevice === 'mobile' &&
            mobilePageList.map((mobilePage) => (
              <div>mobile: {mobilePage.score}</div>
            ))
          }
          {/* desktop */}
          { !loading && results && selectedDevice === 'desktop' &&
            pageList.map((page) => (
              <div>desktop: {page.score}</div>
            ))
          }
        </div>
      </section>
    </div>
  )
}

export default page