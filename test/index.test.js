describe('Login', () => {

    it('Valid', () => {
        let email = "15BoltonT@nobel.herts.sch.uk";
        let pass = "jenson"

        
        const { user, session, error } = await supabase.auth.signIn({
            email: email,
            password: pass,
        })

        expect(error).toBe(null);

    });

    it.todo('Invalid details');

});