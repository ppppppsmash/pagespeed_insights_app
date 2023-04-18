import React, { FC, Suspense } from 'react'

interface Props {
  name: string,
  url: string,
  score: number,
  date: string,
  onClick(): void,
}

const PageScoreTable: FC<Props> = (props): JSX.Element => {
  return (
    <div>
      <h3 className='text-xl font-bold mx-auto w-full mt-8'>{props.name}</h3>
      <table className='rounded-t-lg my-2 w-full mx-auto bg-gray-200 text-gray-800'>
        <thead>
          <tr className='text-left border-b-2 border-gray-300'>
            <th className='px-4 py-3'>URL</th>
            <th className='px-4 py-3'>スコア</th>
            <th className='px-4 py-3'>取得日時</th>
          </tr>
        </thead>
        <tbody>
        <tr className='bg-gray-100 border-b border-gray-200'>
            <td className='px-4 py-3'>{props.url}</td>
            <td className='px-4 py-3'>{props.score}</td>
            <td className='px-4 py-3'>{props.date}</td>
            <td className='px-4 py-3'>
              <button type='button' className='transition block w-full bg-gray-900 mt-4
              py-2 rounded-2xl text-white font-semibold mb-2 active:bg-gray-500
              hover:scale-[0.95] active:scale-[1]'
              onClick={() => props.onClick()}>再取得</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PageScoreTable