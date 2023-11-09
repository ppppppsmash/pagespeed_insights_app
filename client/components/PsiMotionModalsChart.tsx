'use client'
import { useState } from 'react'
import { PSIMetrics } from '@/type'
import { Flex, Card, Text, LineChart, Color as TremorColor } from '@tremor/react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowsPointingInIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { formatDate } from '@/utils/formatDate'

interface Props {
  siteMetrics: PSIMetrics[]
  categories: string[]
}

export default function PsiMotionModalsChart({ categories, siteMetrics }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const colors: TremorColor[] = ['rose', 'emerald', 'orange', 'lime', 'violet', 'pink']

  const formattedCategories = (category: string) : string => {
    switch (category) {
      case 'lcp':
        return 'Largest Contentful Paint'
      case 'fcp':
        return 'First Contentful Paint'
      case 'cls':
        return 'Cumulative Layout Shift'
      case 'tbt':
        return 'Total Blocking Time'
      case 'tti':
        return 'Time to Interactive'
      case 'si':
        return 'Speed Index'
      default:
        return category
    }
  }

  return (
    <Flex className='w-full flex-wrap justify-start box-border p-2 -mx-2'>
      {categories.map((category, index) => (
        <div className='sm:w-1/3 w-full p-2' key={index}>
          <motion.div
            whileHover={{
              y: -10,
              transition: { duration: 0.3 },
            }}
            layoutId={index.toString()}
            onClick={() => setSelectedId(index.toString())}
          >
            <Card className='dark:bg-gray-950'>
              <Text className='dark:text-white'>{formattedCategories(category)}</Text>
              <LineChart
                data={siteMetrics}
                index='createdAt'
                categories={[category]}
                colors={[colors[index]]}
                yAxisWidth={40}
                className='dark:text-white'
              />
            </Card>
          </motion.div>
        </div>
      ))}
      <AnimatePresence>
        {selectedId && (
          <Card className='sm:fixed w-full sm:top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2
            -webkit-transform mx-auto sm:w-[1000px] z-10 dark:bg-gray-950'>
            <motion.div
              className='relative p-4'
              layoutId={selectedId}>
              <motion.button
                className='absolute -top-4 right-0'
                whileTap={{ scale: 1.5 }}
                onClick={() => setSelectedId(null)}
              >
                <ArrowsPointingInIcon className='w-5 h-5 text-gray-600 hover:scale-[0.9]' />
              </motion.button>
              <LineChart
                data={siteMetrics}
                index='createdAt'
                categories={[categories[parseInt(selectedId)]]}
                colors={[colors[parseInt(selectedId)]]}
                yAxisWidth={40}
              />
            </motion.div>
          </Card>
        )}
      </AnimatePresence>
    </Flex>
  )
}
