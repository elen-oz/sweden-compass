import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

interface FrontMatter {
  title: string
  date: string
  author: string
  tags?: string[]
  excerpt?: string
  // [key: string]: any
}

interface ArticleParams {
  language: string
  category: string
  slug: string
}

const components = {
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h1 className="my-4 text-3xl font-bold" {...props} />
  ),
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 className="my-3 text-2xl font-bold" {...props} />
  ),
  ul: (props: React.HTMLProps<HTMLUListElement>) => (
    <ul className="my-2 list-disc pl-5" {...props} />
  ),
}

async function getArticleContent(params: ArticleParams) {
  const { language, category, slug } = params
  const filePath = path.join(process.cwd(), 'content', 'articles', category, language, `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    return null
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    frontMatter: data as FrontMatter,
    content,
  }
}

export default async function ArticlePage({ params }: { params: ArticleParams }) {
  const articleData = await getArticleContent(params)

  if (!articleData) {
    return notFound()
  }

  const { frontMatter, content } = articleData

  return (
    <div className="article-container">
      <h1>{frontMatter.title}</h1>
      <div className="metadata">
        <span>Дата: {frontMatter.date}</span>
        <span>Автор: {frontMatter.author}</span>
      </div>
      <MDXRemote source={content} components={components} />
    </div>
  )
}

export async function generateStaticParams() {
  return [
    {
      language: 'ru',
      category: 'immigration',
      slug: 'residence-permit',
    },
  ]
}
