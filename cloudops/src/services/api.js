const STORAGE_KEY = "resources"

// GET all resources
export const getResources = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  return Promise.resolve(data ? JSON.parse(data) : [])
}

// ADD resource
export const createResource = async (resource) => {
  const resources = await getResources()
    const updated = [...resources, resource]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return await Promise.reject(resource)
}

// UPDATE resource
export const updateResourceAPI = async (updatedResource) => {
  const resources = await getResources()
    const updated = resources.map((r) => r.id === updatedResource.id ? updatedResource : r
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return await Promise.resolve(updatedResource)
}

// DELETE resource
export const deleteResourceAPI = async (id) => {
  const resources = await getResources()
    const updated = resources.filter((r) => r.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return await Promise.resolve(id)
}