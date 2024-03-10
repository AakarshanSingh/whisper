import { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import useConversation from '../zustand/useConversation';
import useGetConversations from '../hooks/useGetConversations';
import { toast } from 'react-toastify';

const SearchInput = () => {
  const [search, setSearch] = useState('');
  const { setSelectedConversation } = useConversation;
  const { conversations } = useGetConversations();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error('S');
    }
    const conversation = conversations.find((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch('');
    } else {
      toast.error('No user found');
    }
  };

  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input w-full input-bordered rounded-full h-10 bg-primary border-secondary"
      />
      <button type="submit" className="btn btn-circle">
        <CiSearch className="w-6 h-6 outline-none" />
      </button>
    </form>
  );
};

export default SearchInput;
