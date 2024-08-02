import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getcolor } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utiles/contants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useAppStore } from "@/store";

const NewDM = () => {
  const { setSelectedChatData,setSelectedChatType } = useAppStore()
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedContacts, setsearchedContacts] = useState([]);

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTES,
          { searchTerm },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data.contacts) {
          setsearchedContacts(response.data.contacts);
        } else {
          setsearchedContacts([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModel(false)
    setSelectedChatType('contact');
    setSelectedChatData(contact);
    setsearchedContacts([])
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              onClick={() => setOpenNewContactModel(true)}
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Plese select a contact</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              onChange={(e) => searchContacts(e.target.value)}
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
            />
          </div>
          {
            searchContacts.length>0 && <ScrollArea className="h-[250px]">
            <div className="flex flex-col gap-5">
              {searchedContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex gap-3 items-center cursor-pointer"
                  onClick={()=>selectNewContact(contact)}
                >
                  <div className="w-12 h-12 relative "
                  >
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden ">
                      {contact.image ? (
                        <AvatarImage
                          src={`${HOST}/${contact.image}`}
                          alt="profile"
                          className="object-cover w-full h-full bg-black"
                        />
                      ) : (
                        <div
                          className={`uppercase h-12 w-12 text-lg border-[3px] flex items-center justify-center rounded-full ${getcolor(
                            contact.color
                          )}`}
                        >
                          {contact.firstName
                            ? contact.firstName.split("").shift()
                            : contact.email.split("").shift()}
                        </div>
                      )}
                    </Avatar>
                  </div>

                  <div className="flex flex-col">
                    <span>
                      {contact.firstName && contact.lastName
                      ? `${contact.firstName} ${contact.lastName}`
                        : `${contact.email}`}
                    </span>
                    <span className="text-xs">
                      ${contact.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          }
          {searchedContacts.length <= 0 && (
            <div className="flex-1 mt-5 md:mt-0 md:flex flex-col justify-center items-center  duration-1000 tranision-all ">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOptions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center ">
                <h3 className="poppins-medium">
                  Hi <span className="text-purple-500">!</span> Search New
                  <span className="text-purple-500"> Contact.</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
