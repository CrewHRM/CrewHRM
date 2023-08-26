export const POSITION_TYPES = [
    'top left',
    'top center',
    'top right',
    'right top',
    'right center',
    'right bottom',
    'bottom left',
    'bottom center',
    'bottom right',
    'left top',
    'left center',
    'left bottom'
    //'center center',
];

const getCoordinatesForPosition = (
    triggerBounding,
    ContentBounding,
    //PopupPosition | PopupPosition[],
    position,
    arrow,
    { offsetX, offsetY }
) => {
    const margin = arrow ? 8 : 0;
    const args = position.split(' ');
    // the step N 1 : center the popup content => ok
    const CenterTop = triggerBounding.top + triggerBounding.height / 2;
    const CenterLeft = triggerBounding.left + triggerBounding.width / 2;
    const { height, width } = ContentBounding;
    let top = CenterTop - height / 2;
    let left = CenterLeft - width / 2;
    let transform = '';
    let arrowTop = '0%';
    let arrowLeft = '0%';
    // the  step N 2 : => ok
    switch (args[0]) {
        case 'top':
            top -= height / 2 + triggerBounding.height / 2 + margin;
            transform = `rotate(180deg)  translateX(50%)`;
            arrowTop = '100%';
            arrowLeft = '50%';
            break;
        case 'bottom':
            top += height / 2 + triggerBounding.height / 2 + margin;
            transform = `rotate(0deg) translateY(-100%) translateX(-50%)`;
            arrowLeft = '50%';
            break;
        case 'left':
            left -= width / 2 + triggerBounding.width / 2 + margin;
            transform = ` rotate(90deg)  translateY(50%) translateX(-25%)`;
            arrowLeft = '100%';
            arrowTop = '50%';
            break;
        case 'right':
            left += width / 2 + triggerBounding.width / 2 + margin;
            transform = `rotate(-90deg)  translateY(-150%) translateX(25%)`;
            arrowTop = '50%';
            break;
        default:
    }
    switch (args[1]) {
        case 'top':
            top = triggerBounding.top;
            arrowTop = `${triggerBounding.height / 2}px`;
            break;
        case 'bottom':
            top = triggerBounding.top - height + triggerBounding.height;
            arrowTop = `${height - triggerBounding.height / 2}px`;
            break;
        case 'left':
            left = triggerBounding.left;
            arrowLeft = `${triggerBounding.width / 2}px`;
            break;
        case 'right':
            left = triggerBounding.left - width + triggerBounding.width;
            arrowLeft = `${width - triggerBounding.width / 2}px`;
            break;
        default:
    }

    top = args[0] === 'top' ? top - offsetY : top + offsetY;
    left = args[0] === 'left' ? left - offsetX : left + offsetX;

    return { top, left, transform, arrowLeft, arrowTop };
};

export const getTooltipBoundary = (keepTooltipInside) => {
    // add viewport
    let boundingBox = {
        top: 0,
        left: 0,
        /* eslint-disable-next-line no-undef */
        width: window.innerWidth,
        /* eslint-disable-next-line no-undef */
        height: window.innerHeight
    };
    if (typeof keepTooltipInside === 'string') {
        /* eslint-disable-next-line no-undef */
        const selector = document.querySelector(keepTooltipInside);
        if (process.env.NODE_ENV !== 'production') {
            if (selector === null)
                throw new Error(
                    `${keepTooltipInside} selector does not exist : keepTooltipInside must be a valid html selector 'class' or 'Id'  or a boolean value`
                );
        }
        if (selector !== null) boundingBox = selector.getBoundingClientRect();
    }

    return boundingBox;
};

const calculatePosition = (
    triggerBounding,
    ContentBounding,
    position,
    arrow,
    { offsetX, offsetY },
    keepTooltipInside
) => {
    let bestCoords = {
        arrowLeft: '0%',
        arrowTop: '0%',
        left: 0,
        top: 0,
        transform: 'rotate(135deg)'
    };
    let i = 0;
    const wrapperBox = getTooltipBoundary(keepTooltipInside);
    let positions = Array.isArray(position) ? position : [position];

    // keepTooltipInside would be activated if the  keepTooltipInside exist or the position is Array
    if (keepTooltipInside || Array.isArray(position)) positions = [...positions, ...POSITION_TYPES];

    // add viewPort for WarpperBox
    // wrapperBox.top = wrapperBox.top + window.scrollY;
    // wrapperBox.left = wrapperBox.left + window.scrollX;

    while (i < positions.length) {
        bestCoords = getCoordinatesForPosition(
            triggerBounding,
            ContentBounding,
            positions[i],
            arrow,
            { offsetX, offsetY }
        );

        const contentBox = {
            top: bestCoords.top,
            left: bestCoords.left,
            width: ContentBounding.width,
            height: ContentBounding.height
        };

        if (
            contentBox.top <= wrapperBox.top ||
            contentBox.left <= wrapperBox.left ||
            contentBox.top + contentBox.height >= wrapperBox.top + wrapperBox.height ||
            contentBox.left + contentBox.width >= wrapperBox.left + wrapperBox.width
        ) {
            i++;
        } else {
            break;
        }
    }

    return bestCoords;
};

export default calculatePosition;
