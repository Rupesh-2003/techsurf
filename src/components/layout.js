import Navbar from './navbar/navbar'
 
export default function Layout({ children }) {
  return (
    <div className='flex flex-row'>
      <Navbar />
      <main className='flex flex-col flex-grow'>{children}</main>
    </div>
  )
}