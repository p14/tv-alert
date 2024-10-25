import { FormEvent, useState } from 'react';
import { Search } from '@mui/icons-material';
import { Box, Container, IconButton, InputAdornment, TextField } from '@mui/material';
import { useRequest } from '../../helpers/request.helpers';
import { MediaContent } from '../../typings/media.types';
import { useSnackbarContext } from '../../context/snackbar.context';
import { searchToolbarWrapperStyles } from '../../styles/search.styles';

interface SearchToolbarProps {
    setItems: (mediaContent: MediaContent[]) => void
}

const SearchToolbar = ({
    setItems
}: SearchToolbarProps) => {
    const { makePublicRequest, parseErrorMessage } = useRequest();

    const { setErrorAlert } = useSnackbarContext();

    const [search, setSearch] = useState<string>('');

    const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const url = `${import.meta.env.VITE_SERVER_URL}/integrations/search?query=${encodeURIComponent(search)}`;
            const { data } = await makePublicRequest({ url });
            setItems(data);
        } catch (e: any) {
            const message = parseErrorMessage(e);
            setErrorAlert(message);
        }
    };

    return (
        <Container maxWidth='sm'>
            <Box
                component='form'
                onSubmit={handleSearch}
                sx={searchToolbarWrapperStyles}>
                <TextField
                    fullWidth
                    id='outlined-search'
                    type='search'
                    variant='outlined'
                    placeholder='Search for a series...'
                    size='small'
                    onChange={(e) => { setSearch(e.currentTarget.value); }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <IconButton disabled={!search} type='submit' size='small'>
                                    <Search />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }} />
            </Box>
        </Container>
    )
}

export default SearchToolbar
