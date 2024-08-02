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
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTES, HOST, SEARCH_CONTACTS_ROUTES } from "@/utiles/contants";
import { useAppStore } from "@/store";
import MultipleSelector from "@/components/ui/multiplel-select";
import { Button } from "@/components/ui/button";

const CreateChannel = () => {
  const { setSelectedChatData,setSelectedChatType,addChannel } = useAppStore()
  const [newChannelModel, setNewChannelModel] = useState(false);
  const [allContacts, setAllContacts] = useState([])
  const [selectedContacts, setselectedContacts] = useState([]);
  const [channelName, setChannelName] = useState('');

  useEffect(() => {
    const getData = async () => {
      const response = await apiClient.get(GET_ALL_CONTACTS_ROUTES, { withCredentials: true })
      setAllContacts(response.data.contacts)
    }
    getData()
  },[])

  const CreateChannel = async () => { 
    try {
      console.log('#1',channelName)
      console.log('#1',selectedContacts)
      if (channelName.length > 0 && selectedContacts.length > 0) {
        console.log('#2',selectedContacts)
        const response = await apiClient.post(CREATE_CHANNEL_ROUTE, {
          name: channelName,
          members: selectedContacts.map((contact) => contact.value),
          
        }, { withCredentials: true });

        if (response.status === 201) {
          setChannelName('')
          setselectedContacts([]);
          setNewChannelModel(false);
          addChannel(response.data.channel);
        }
      }
    } catch (error) {
      console.log({error})
    }
   };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              onClick={() => setNewChannelModel(true)}
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Create New Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModel} onOpenChange={setNewChannelModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please fill up the details for the new channel.</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              value={channelName}
            />
          </div>
          <div>
            <MultipleSelector
              className='rounded-lg bg-[#2c2e3b] border-none py-2 text-white'
              defaultOptions={allContacts}
              placeholder='Search Contacts'
              value={selectedContacts}
              onChange={setselectedContacts}
              emptyIndicator={
                <p className="text-center text-lg leading-10 text-gray-600">No results found.</p>
              }
            />
          </div>
          <div>
            <Button className='w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 '
            onClick={CreateChannel}
            >Create Channel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
