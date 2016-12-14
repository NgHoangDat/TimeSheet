function login() {
    console.log("den day roi");

    $.ajax({
        url: "/home",
        type: 'GET',
        beforeSend : function(xhr) {
        // xhr.setRequestHeader("token", token);
        // xhr.setRequestHeader("id", id);

        },
        success: function(response) {
            // response
            console.log(response);
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
}
