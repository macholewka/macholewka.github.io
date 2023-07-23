document.getElementById('permission').addEventListener('click', async () => {
    try {
        requestPermissionResult = await Notification.requestPermission()
    } catch(e) {
        alert(e)
        console.log(e)
    }

    alert(requestPermissionResult)

    if (requestPermissionResult === "granted") {
        alert('Permission granted')

        try {
            registerServiceWorker()
        }
        catch (e) {
            alert(e)
            console.log(e)
        }
        alert("Permission granted")
    }

    function randomNotification() {
        const options = {
            body: "body",
        };
        new Notification("title", options);
        setTimeout(randomNotification, 3000);
    }
})

registerServiceWorker()