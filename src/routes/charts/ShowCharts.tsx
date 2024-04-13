/* eslint-disable @typescript-eslint/no-explicit-any */
import Plotly from 'plotly.js-cartesian-dist'
import { useEffect, useRef, useState } from 'react'
import createPlotlyComponent from 'react-plotly.js/factory'
import { useAppSelector } from '../../hooks/hooks'

import { useNavigate, useOutletContext } from 'react-router-dom'
import Loading from '../../utils/Loading'
import AddChartData from './AddChartData'
import UploadDialogue from './UploadDialogue'

interface chartItem {
  [key: string]: string
}

interface chartData {
  data: any[]
  dataKeys: string[]
  layout: any
  chartId: number
  title: string
  description: string
  authorId: number
}

const chartConfig = {
  displaylogo: false,
  responsive: true,
  displayModeBar: true,
}

export default function ShowCharts() {
  const role = useAppSelector((state) => state.auth.role)
  const userId = useAppSelector((state) => state.auth.userId)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [chartData, setChartData] = useState<chartData[]>([])
  const settings = useAppSelector((state) => state.settings.settings)
  const [loading, setLoading] = useState(true)
  const activeChartId = useRef<number>()
  const toc = useRef<HTMLUListElement>(null)
  const [selectedChart, setSelectedChart] = useState<chartData | null>(null)
  const HOST = import.meta.env.VITE_REACT_API_URL
  const Plot = createPlotlyComponent(Plotly)
  const [displayMode, setTitle, setDescription] = useOutletContext() as [
    boolean,
    Function,
    Function
  ]

  useEffect(() => {
    setTitle('Charts dashboard')
    setDescription(
      'Manage and visualize data and insights through interactive charts.'
    )
  }, [])

  const parseChartData = (charts: any[]) => {
    if (!charts || !Array.isArray(charts) || charts.length === 0) {
      return null
    }
    const chartObjects = charts.map((chart) => {
      const dataKeys = Object.keys(chart.data[0])

      const dataSeries = dataKeys
        .filter((key) => key.toLowerCase() !== 'date')
        .map((key) => ({
          x: chart.data.map((item: chartItem) => {
            const dateValue = item['Date'] || item['date']
            return dateValue
          }),
          y: chart.data.map((item: chartItem) => parseFloat(item[key])),
          type: 'scatter',
          mode: 'lines+markers',
          marker: {
            size: 10,
          },
          line: {
            width: 3,
          },
          name: key,
        }))

      return {
        dataKeys: dataKeys,
        data: dataSeries,
        chartId: chart.id,
        title: chart.title,
        description: chart.description,
        authorId: chart.authorId,
        layout: {
          plot_bgcolor: !displayMode ? '#ffffff' : '#030000',
          paper_bgcolor: !displayMode ? '#ffffff' : '#030000',
          modebar: {
            orientation: 'v',
          },
          legend: {
            x: 0,
            y: 1,
            xanchor: 'left',
            yanchor: 'top',
            font: {
              family: 'sans-serif',
              size: 12,
              color: !displayMode ? 'black' : 'white',
            },
          },
          line: {
            width: 3,
          },
          margin: {
            l: 50,
            r: 70,
            b: 70,
            t: 10,
            pad: 4,
          },
          xaxis: {
            title: 'Date',
            color: !displayMode ? 'black' : 'white',
          },
          yaxis: {
            title: 'Values',
            color: !displayMode ? 'black' : 'white',
          },
        },
      }
    })

    return chartObjects
  }

  const fetchCharts = async () => {
    try {
      const response = await fetch(`${HOST}/charts`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 405) {
          navigate('/waiting')
        } else if (response.status === 403) {
          navigate('/login')
        } else {
          throw new Error('Failed to fetch articles')
        }
        return
      }
      const charts = await response.json()
      const parsedData = parseChartData(charts)
      if (parsedData == null) {
        setChartData([])
      } else {
        setChartData(parsedData)
        activeChartId.current = parsedData[0].chartId
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCharts()
  }, [token])

  const handleAddData = (chart: chartData) => {
    setSelectedChart(chart)
    ;(
      document.getElementById('add_chart_data') as HTMLDialogElement
    )?.showModal()
  }

  useEffect(() => {
    if (selectedChart) {
      ;(
        document.getElementById('add_chart_data') as HTMLDialogElement
      )?.showModal()
    }
  }, [selectedChart])

  useEffect(() => {
    if (!chartData.length) return
    const updatedChartData = chartData.map((chart) => ({
      ...chart,
      layout: {
        ...chart.layout,
        plot_bgcolor: !displayMode ? '#ffffff' : '#030000',
        paper_bgcolor: !displayMode ? '#ffffff' : '#030000',
        xaxis: {
          color: !displayMode ? 'black' : 'white',
        },
        yaxis: {
          color: !displayMode ? 'black' : 'white',
        },
        legend: {
          ...chart.layout.legend,
          font: {
            ...chart.layout.legend.font,
            color: !displayMode ? 'black' : 'white',
          },
        },
      },
    }))

    setChartData(updatedChartData)
  }, [displayMode])

  const handleDelete = async (id: number) => {
    if (role === 'ADMIN_USER' || role === 'EDITOR_USER') {
      const confirmed = window.confirm(
        'Are you sure you want to delete this chart?'
      )
      if (!confirmed) {
        return
      }
      try {
        const url = `${HOST}/admin/chart/${id}`
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          fetchCharts()
        } else {
          const errorData = await response.json()
          console.error(
            'Error deleting Chart:',
            errorData || response.statusText
          )
        }
      } catch (error) {
        console.error('Error:', error)
      }
    } else {
      console.warn('Unauthorized user: You cannot delete Charts.')
    }
  }

  const scrollToChart = (chartId) => {
    activeChartId.current = chartId

    const element = document.getElementById(chartId)

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY

      const active = Array.from(document.querySelectorAll('.chart')).find(
        ({ id }) => {
          const element = document.getElementById(id)

          if (element) {
            const offsetTop = element.offsetTop * 0.75
            const offsetBottom = offsetTop + element.offsetHeight

            return scrollPosition >= offsetTop && scrollPosition < offsetBottom
          }

          return false
        }
      )

      if (!active) {
        return
      }

      activeChartId.current = parseInt(active.id, 10)

      toc.current.querySelectorAll('li').forEach((li) => {
        li.classList.remove('active')

        if (li.id === `li-${activeChartId.current}`) {
          li.classList.add('active')
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [token])

  if (loading) return <Loading />
  return (
    <div>
      <UploadDialogue fetchCharts={fetchCharts} />
      {chartData.length == 0 ? (
        <div className='flex flex-col w-72 md:w-full items-center mx-auto md:pr-20'>
          <p className='text-lg md:text-3xl text-center text-gray-600 dark:text-gray-400 mt-20'>
            No charts are currently available. <br />
          </p>
          {(role === 'ADMIN_USER' || role === 'EDITOR_USER') && (
            <>
              <p className='text-lg md:text-xl text-center text-gray-600 dark:text-gray-400'>
                You can start by uploading a new chart using the button below.
              </p>
              <button
                className='btn btn-primary'
                onClick={() =>
                  (
                    document.getElementById('my_modal_1') as HTMLDialogElement
                  )?.showModal()
                }
              >
                Upload new
              </button>
            </>
          )}
        </div>
      ) : (
        <div>
          <div>
            <div className='w-full md:max-w-60 text-center mx-auto mb-8'>
              <div>
                <div className='p-2 text-2xl text-white bg-black rounded-t-3xl'>
                  Quadrant
                </div>
                <div className='flex justify-stretch'>
                  <div className='w-full bg-gradient-to-r from-red-500 to-red-200 border border-gray-500 p-2 font-semibold dark:text-white rounded-bl-3xl'>
                    {settings.previous}
                  </div>
                  <div className='w-full bg-gradient-to-r from-violet-500 to-blue-300 border border-gray-500 p-2 font-semibold dark:text-white rounded-br-3xl'>
                    {settings.actual}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className='flex flex-col w-full md:w-3/4'>
              <div className='grid grid-cols-1 md:grid-cols-1 gap-6'>
                {chartData &&
                  chartData.map((chart) => (
                    <div
                      className='carousel-vertical h-full w-full overflow-auto my-4 chart'
                      id={chart.chartId.toString()}
                      key={chart.chartId}
                    >
                      <h2 className='card-title text-3xl leading-none'>
                        {' '}
                        {chart.title}
                      </h2>
                      <p>{chart.description}</p>
                      <div
                        id={chart.chartId.toString()}
                        key={chart.chartId}
                        className='carousel-item w-full rounded-lg bg-base-100 shadow-xl mt-6 dark:bg-black'
                      >
                        <div className='p-2 w-full'>
                          <Plot
                            key={chart.chartId}
                            style={{ marginTop: '10px' }}
                            data={chart.data}
                            layout={chart.layout}
                            config={chartConfig}
                          />
                          <div className='card-actions justify-between mt-4'>
                            {(role === 'ADMIN_USER' ||
                              (role === 'EDITOR_USER' &&
                                chart.authorId == Number(userId))) && (
                              <div className='flex gap-x-2'>
                                <button
                                  className='btn'
                                  onClick={() => handleAddData(chart)}
                                >
                                  Add data
                                </button>
                                <button
                                  onClick={() => handleDelete(chart.chartId)}
                                  className='btn btn-red'
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {selectedChart && (
                  <AddChartData
                    chart={selectedChart}
                    onClose={() => setSelectedChart(null)}
                    fetchCharts={fetchCharts}
                  />
                )}
              </div>
            </div>
            <div className='gap-y-5 fixed top-44 right-0 hidden md:block md:w-1/4'>
              {(role === 'ADMIN_USER' || role === 'EDITOR_USER') && (
                <button
                  className='btn btn-primary'
                  onClick={() =>
                    (
                      document.getElementById('my_modal_1') as HTMLDialogElement
                    )?.showModal()
                  }
                >
                  Upload new
                </button>
              )}
              <div className='mt-6'>
                <ul
                  className='max-w-md space-y-1 text-black list-none list-inside dark:text-gray-400'
                  ref={toc}
                >
                  {chartData.map((chart) => (
                    <li
                      key={chart.chartId}
                      id={`li-${chart.chartId}`}
                      className={`uppercase hover:cursor-pointer list-item ${
                        activeChartId.current === chart.chartId ? 'active' : ''
                      }`}
                      onClick={() => scrollToChart(chart.chartId.toString())}
                    >
                      {chart.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
