
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://cinvrhnlxmkszbrirgxg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjIxNzMzMCwiZXhwIjoxOTUxNzkzMzMwfQ.AUCfgsxVNn7LyUIoqqxYsF4Rqs-CeQEkLNBwKBzkpBo')

const { user, session, error } = await supabase.auth.signIn({

});

describe('Supabase', () => {

    it('Get Notes', async () => {

        const { data, error } = await supabase
        .from('cities')
        .select();

        console.log(data);

        expect(error).toBe(null);
    
    });

    it.todo('Get Tasks');

    it.todo('Get Bugs');

    it.todo('Add Notes');

    it.todo('Add Tasks');

    it.todo('Add Bugs');

});