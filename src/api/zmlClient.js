import { zmlConfig } from '@/api/constants';

function client(endpoint, {body, ...customConfig} = {}) {
  const headers = {'Accept': 'application/json'
                  ,'Content-Type': 'application/json;charset=UTF-8'}
  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    }
  }
  if (body) {
    config.body = JSON.stringify(body)
  }

  return window
    .fetch(endpoint ? endpoint : zmlConfig.apiPath, config)
    .then(async response => {
      if (response.status === 401) {
        alert('This should only happen on a token issue')
        return
      }
      if (response.ok) {
        return await response.json()
      } else {
        const errorMessage = await response.text()
        return Promise.reject(new Error(errorMessage))
      }
    })
}