import Navbar from './navbar/navbar'
 
export default function Layout({ children }) {
  return (
    <div className='flex flex-row relative'>
      <Navbar />
      <main className='flex flex-col flex-grow relative'>{children}</main>
    </div>
  )
}