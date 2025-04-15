export default Page

import { useData } from '../../../../renderer/useData'
import type { Data } from './+data'

function Page() {
  const { movies } = useData<Data>()
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Star Wars Movies</h1>
      <ul className="menu bg-base-200 w-full max-w-xs rounded-box mb-8">
        {movies.map(({ id, title, release_date }) => (
          <li key={id}>
            <a href={`/star-wars/${id}`} className="hover:bg-base-300">
              <span className="font-medium">{title}</span>
              <span className="text-sm opacity-70">({release_date})</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="alert alert-info mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>
          Source: <a href="https://brillout.github.io/star-wars/" className="link link-info">brillout.github.io/star-wars</a>
        </span>
      </div>
      <div className="alert alert-success">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>
          Data can be fetched by using the <code className="badge badge-neutral">data()</code> hook.
        </span>
      </div>
    </>
  )
}
