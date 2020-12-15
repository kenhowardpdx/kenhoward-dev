interface PostDetail {
  summary: string
  title: string
  url: string
}

const getPostUrlFromPath = (
  path: string,
  postsPath: string,
  prefix: string
): string => {
  const [year, month, day, ...postPath] = path
    .slice(postsPath.length + 1, path.lastIndexOf('.'))
    .split('-')

  return `${prefix}/${year}/${month}/${day}/${postPath.join('-')}`
}

export { getPostUrlFromPath, PostDetail }
