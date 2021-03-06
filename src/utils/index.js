function padding(s, len) {
  len = len - (s + '').length
  for (var i = 0; i < len; i++) { s = '0' + s }
  return s
}

export function formatTime(date, pattern) {
  if (!date) { return '' }
  date = typeof date === 'string' ? new Date(date) : date

  pattern = pattern || 'yyyy-MM-dd'
  return pattern.replace(/([yMdhsm])(\1*)/g, function($0) {
    switch ($0.charAt(0)) {
      case 'y': return padding(date.getFullYear(), $0.length)
      case 'M': return padding(date.getMonth() + 1, $0.length)
      case 'd': return padding(date.getDate(), $0.length)
      case 'w': return date.getDay() + 1
      case 'h': return padding(date.getHours(), $0.length)
      case 'm': return padding(date.getMinutes(), $0.length)
      case 's': return padding(date.getSeconds(), $0.length)
    }
  })
}

export function treeToList(tree = [], idValue = null, childrenField = 'children', idField = 'id', parentIdField = 'parentId') {
  const list = []
  if (!childrenField) childrenField = 'children'
  for (let i = 0, j = tree.length; i < j; i++) {
    const d = tree[i]
    const id = d[idField]
    if (!list.some(l => l[idField] === id)) {
      list.push(d)
    }
    if (parentIdField) d[parentIdField] = idValue
    const children = d[childrenField]
    if (children && children.length > 0) {
      const items = treeToList(children, id, childrenField, idField, parentIdField)
      const values = items.values()
      for (const v of values) {
        if (!list.some(l => l[idField] === v[idField])) {
          list.push(v)
        }
      }
    }
  }
  return list
}

export function listToTree(list = [], root = null, idField = 'id', parentIdField = 'parentId') {
  const tree = []
  const hash = {}
  const childrenField = 'children'
  for (let i = 0, l = list.length; i < l; i++) {
    const d = list[i]
    hash[d[idField]] = d
  }

  for (let i = 0, l = list.length; i < l; i++) {
    const d = list[i]
    const parentID = d[parentIdField]
    if (parentID === '' || parentID === 0) {
      tree.push(d)
      continue
    }

    const parent = hash[parentID]
    if (!parent) {
      tree.push(d)
      continue
    }

    let children = parent[childrenField]
    if (!children) {
      children = []
      parent[childrenField] = children
    }
    children.push(d)
  }

  if (root) {
    root[childrenField] = tree
    return [root]
  }

  return tree
}

export function getListParents(list = [], idValue, idField = 'id', parentIdField = 'parentId') {
  const parents = []
  const self = list.find(o => o[idField] === idValue)
  let parent = list.find(o => o[idField] === self[parentIdField])
  while (parent && parent[idField] > 0) {
    parents.unshift(parent)
    parent = list.find(o => o[idField] === parent[parentIdField])
  }
  return parents
}

export function getTreeParents(tree = [], idValue, childrenField = 'children', idField = 'id', parentIdField = 'parentId', parentIdValue = 0) {
  const list = treeToList(tree, parentIdValue, childrenField, idField, parentIdField)
  return getListParents(list, idValue, idField, parentIdField)
}
