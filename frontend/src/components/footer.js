function Footer()
{
     const socialLinks = [
    { icon: 'fab fa-youtube', url: 'https://youtube.com/@whynotyou-2006?si=S-1BGOIgIzQk2DuG', color: 'hover:text-red-600' },
    { icon: 'fab fa-github', url: 'https://github.com/SravanamRakeshKumar', color: 'hover:text-yellow-800' },
    { icon: 'fab fa-instagram', url: 'https://www.instagram.com/rakesht_the_rock?igsh=dHA5ZjNvZGNucHdi', color: 'hover:text-pink-600' },
    { icon: 'fas fa-envelope', url: 'mailto:sravanamrakeshkumar3@gmail.com', color: 'hover:text-blue-600' },
    { icon: 'fab fa-linkedin', url: 'https://www.linkedin.com/in/sravanam-rakesh-kumar-418ab7283', color: 'hover:text-blue-600' }
  ];

    return(
        <>
<footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold mb-4">Why Not You</div>
              <p className="text-gray-400">Learn, Practice, Succeed</p>
            </div>
            <div className="flex space-x-6">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className={`text-2xl text-gray-400 transition-colors ${link.color}`}
                >
                  <i className={link.icon}></i>
                </a>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Why Not You. All rights reserved.</p>
          </div>
        </div>
      </footer>

        </>

    );

}
export default Footer;