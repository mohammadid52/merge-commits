import React from 'react';


interface PaginationProps {

}

interface PageWithTextProps {
  children: React.ReactNode
  active: boolean;
  onClick: () => void;
}

const Active = (activeProps: { page: number, onClick: () => void }) => (
  <button onClick={activeProps.onClick} className='btn btn-circle btn-indigo w-auto'>
    {activeProps.page}
  </button>
)

const Inactive = (InActiveProps: { page: number, onClick: () => void }) => (
  <button onClick={InActiveProps.onClick} className="btn btn-circle btn-default-color w-auto">
    {InActiveProps.page}
  </button>
)

const PageNo = (pageNoProps: { page: number, currentPage: number, onClick: () => void }) => {
  const { page, onClick, currentPage } = pageNoProps;
  if (page === currentPage) return <Active onClick={onClick} page={page} />
  return <Inactive onClick={onClick} page={page} />
}

const PageCount = (pageCountProps: { totalPages: number, currentPage: number, onClick: () => void }) => {
  const { totalPages, onClick, currentPage } = pageCountProps;

  const items = Array.from(Array(totalPages).keys())
  console.log(items)
  return (
    <>
      {items.map((i, index) => (
        <PageNo
          onClick={onClick}
          page={index}
          currentPage={currentPage}
          key={index}
        />
      ))}
    </>
  )
}

const PageWithText: React.FC<PageWithTextProps> = (pageProps: PageWithTextProps) => {
  const { active, children, onClick } = pageProps;
  if (active)
    return (
      <button onClick={onClick} className={`btn btn-default btn-indigo w-auto`}>
        {children}
      </button>
    )
  return (
    <button onClick={onClick} className="btn btn-default btn-default-color w-auto">
      {children}
    </button>
  )
}

const Pagination: React.FC<PaginationProps> = (pageProps: PaginationProps) => {
  const { } = pageProps
  return (
    <div className="flex flex-wrap items-center justify-start children-x-2 pagination">
      <PageWithText onClick={() => console.log('dd')} active={true}>
        First
      </PageWithText>
      <PageWithText onClick={() => console.log('ddd')} active={true} >
        Previous
      </PageWithText>
      <PageCount
        onClick={() => null}
        currentPage={items.currentPage}
        totalPages={items.totalPages}
      />
      <PageWithText onClick={() => null} active={true}>
        Next
    </PageWithText>
      <PageWithText onClick={() => null} active={true}>
        Last
    </PageWithText>
    </div>
  )
}

export default Pagination

// This will be replaced with props.
const items = {
  currentPage: 0,
  totalPages: 10,
}