# wedding
A responsive wedding site with:
- Guest subscription (including intltel library for the telephone input field)
- Very responsive cards listings for the content (planning, hotel, touristic spots...) (content is stored in very simple json file)
- Interactive map with spots :
    - dynamically bounded to the content cards
    - dynamically bounded to guestroom listing and details (to help guests find their rooms and pay the right price at location)
- Digital guestbook with possibility to upload webcam video, video file or picture 
- 3D animation at the end of the form submission

Be careful the code is very messy with little organization: I'm not a professional developer.
SvelteJS, Postgraphile, tailwind (with daisyUI) allowed me to develop this very quickly and the result was amazing in term of reliability, compatibility, responsiveness and performance (with little effort). SvelteJS is especially easy to learn.

If you're looking for a wedding planning software you can take a look at https://www.weddingplan.fr/ which is great

## Prerequesites
- PostgreSQL
- nginx
- n
- Amazon S3 subscription

## Build
You can find a git hook script deploy in the folder deploy_scripts

TODO: add the nginx proxy config file

