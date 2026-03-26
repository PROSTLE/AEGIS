import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

export function useApiCall(endpoint, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}${endpoint}`)
        setData(response.data)
        setError(null)
      } catch (err) {
        setError(err.message)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    if (endpoint) {
      fetchData()
    }
  }, [endpoint])

  return { data, loading, error }
}

export function useApiPost(endpoint) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const post = async (payload) => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload)
      setError(null)
      return response.data
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { post, loading, error }
}
