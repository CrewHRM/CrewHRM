// z-index = 9993;
const zIndex = 9993;

const Style = {
    popupContent: {
        tooltip: {
            position: 'absolute',
            zIndex
        },
        modal: {
            position: 'relative',
            margin: 'auto'
        }
    },
    popupArrow: {
        height: '8px',
        width: '16px',
        position: 'absolute',
        background: 'transparent',
        color: '#FFF',
        zIndex: -1
    },
    overlay: {
        tooltip: {
            position: 'fixed',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            zIndex
        },
        modal: {
            position: 'fixed',
            top: '0',
            bottom: '0',
            left: '0',
            right: '0',
            display: 'flex',
            zIndex
        }
    }
};

export default Style;
