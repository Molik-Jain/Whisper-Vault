import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
const Messages = () => {
  return (
    <Sheet >
      <SheetTrigger className="icon">Messages</SheetTrigger>
      <SheetContent className="w-[1200px] sm:w-[800px]">
        <SheetHeader>
          <SheetTitle>Messages</SheetTitle>
          <SheetDescription>
            Welcome to your inbox!
            
            
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Messages;
