import { getcolor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utiles/contants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";


const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handelClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => {
        
         return (
        <div
        key={contact._id}
        className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
          selectedChatData &&
          (selectedChatData._id === contact._id
            ? "bg-[#8417ff] hover:bg-[#8417ff]"
            : "hover:bg-[#f1f1f111]")
          }`}
          onClick={() => handelClick(contact)}
           >
            <div className="flex gap-5 items-center justify-start text-neutral-300 ">
              {!isChannel && (
                <Avatar className={`h-10 w-10 rounded-full overflow-hidden `}>
                  {contact.image ? (
                    <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      alt="profile"
                      className="object-cover w-full h-full  bg-black"
                    />
                  ) : (
                    <div
                      className={`
                        ${
                          selectedChatData &&
                          selectedChatData._id === contact._id
                            ? "bg-[ffffff22] border border-white/70"
                            : getcolor(contact.color)
                        }
                        uppercase h-10 w-10 text-lg border-[3px] flex items-center justify-center rounded-full`}
                    >
                      {contact.firstName ?  contact.firstName.split("").shift()
                          : contact.email.split("").shift()}
                    </div>
                  )}
                </Avatar>
              )}
              {
                       <span className="text-white">
                      {contact.firstName
                        ? `${contact.firstName} ${contact.lastName}`
                        : contact.email}
                    </span>
              }
              {isChannel && (
                <div className="flex w-52 py-2 items-center gap-4 border-[#ffffff23] border-y-[1px] ">
                  <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                    #
                  </div>
                  {isChannel ? (
                    <span>{contact.name}</span>
                  ) : (
                       <span className="text-white">
                      {contact.firstName
                        ? console.log('For name',`${contact.firstName} ${contact.lastName}`)
                        : console.log('for Email',contact.email)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
