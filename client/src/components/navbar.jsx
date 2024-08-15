

import logo from '../assets/logo.png';

const Navbar = () => {
    return (
        <nav style={{ backgroundColor: 'black', color: 'grey', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={logo} alt="Logo" style={{ height: '24px', marginRight: '5px' }} />
                <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase' }}>Codify</div>
            </div>
        </nav>
    );
}

export default Navbar;

