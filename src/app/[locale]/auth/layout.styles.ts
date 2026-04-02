export const getLayoutStyles = () => ({
  page: 'flex min-h-screen flex-col md:flex-row',
  page_introducing: `bg-introducing relative 
  flex w-full flex-1 flex-col items-center 
  justify-center bg-cover bg-center px-5 py-10 text-white`,
  page_introducing_container: `z-10 flex flex-col items-center text-center`,
  page_title: `text-24 md:text-36 mt-4 font-bold`,
  page_description: `text-12 md:text-18 mt-2 leading-relaxed whitespace-pre-line opacity-90`,
  page_cards: `mt-8 grid w-full 
  grid-cols-[repeat(auto-fit,minmax(170px,1fr))] 
  md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] 
  lg:grid-cols-2 gap-4`,
  page_children: `relative -mt-4 flex flex-1
  flex-col items-center justify-center bg-white dark:bg-brand-925
  rounded-t-[20px] px-6 py-8 md:mt-0 md:rounded-none`,
  page_children_item: `w-full max-w-md`,
});
