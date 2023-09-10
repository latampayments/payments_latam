'use client';
import { Bank, Country, Payment } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
const FetchQuery = async(url: string) => {
    let response = await fetch(url) //fetchDataByQuery(url)

    if(!response.ok) {
        throw new Error(`${response.statusText}: Failed to fetch your search.`)
    }
    return response.json()
};

const SearchPage = () => {
    const searchParams = useSearchParams();
    const search = searchParams ? searchParams.get('q') : null;
    const encodedSearchQuery = encodeURI(search || "");
    const {data, isLoading } = useSWR<{query: Array<Country | Bank | Payment>}>(`/api/search?q=${encodedSearchQuery}`, FetchQuery);
    console.log(encodedSearchQuery)
 
    if(data?.query) {
        return null;
    };

    return (
        <h1>Search: {data?.query.map(item => {
            let name = item?.id 
            return (name)
        })}</h1>
    )
}

export default SearchPage;