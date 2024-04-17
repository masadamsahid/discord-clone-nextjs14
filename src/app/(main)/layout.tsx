import NavigationSidebar from "@/_components/navigation/navigation-sidebar";

type Props = {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: Props) {
  return (
    <div className="h-full">
      <div className="fixed z-30 hidden md:flex flex-col h-full w-[72px] inset-y-0">
        <NavigationSidebar/>
      </div>
      <main className="md:pl-[72px] h-full">
        {children}
      </main>
    </div>
  )
}