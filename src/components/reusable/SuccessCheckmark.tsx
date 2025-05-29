import { Box, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import { theme } from '../../config/ThemeConfig';

const SuccessCheckmarkContainer = styled(Box)(({ isMobile }: { isMobile: boolean }) => ({
    width: isMobile ? '60vw' : '80px',
    height: isMobile ? '86vw' : '115px',
    margin: '0 auto',
    '& .check-icon': {
        width: isMobile ? '60vw' : '80px',
        height: isMobile ? '60vw' : '80px',
        position: 'relative',
        borderRadius: '50%',
        boxSizing: 'content-box',
        border: isMobile ? '3vw solid #4CAF50' : '4px solid #4CAF50',
        '&::before': {
            top: isMobile ? '2vw' : '3px',
            left: isMobile ? '-1.5vw' : '-2px',
            width: isMobile ? '22.5vw' : '30px',
            transformOrigin: '100% 50%',
            borderRadius: '100px 0 0 100px',
        },
        '&::after': {
            top: '0',
            left: isMobile ? '22.5vw' : '30px',
            width: isMobile ? '45vw' : '60px',
            transformOrigin: '0 50%',
            borderRadius: '0 100px 100px 0',
            animation: 'rotate-circle 4.25s ease-in',
        },
        '&::before, &::after': {
            content: '""',
            height: isMobile ? '75vw' : '100px',
            position: 'absolute',
            transform: 'rotate(-45deg)',
        },
        '& .icon-line': {
            height: isMobile ? '3.75vw' : '5px',
            backgroundColor: '#4CAF50',
            display: 'block',
            borderRadius: isMobile ? '1.5vw' : '2px',
            position: 'absolute',
            zIndex: 10,
            '&.line-tip': {
                top: isMobile ? '34.5vw' : '46px',
                left: isMobile ? '10.5vw' : '14px',
                width: isMobile ? '18.75vw' : '25px',
                transform: 'rotate(45deg)',
                animation: 'icon-line-tip 0.75s',
            },
            '&.line-long': {
                top: isMobile ? '28.5vw' : '38px',
                right: isMobile ? '6vw' : '8px',
                width: isMobile ? '35.25vw' : '47px',
                transform: 'rotate(-45deg)',
                animation: 'icon-line-long 0.75s',
            },
        },
        '& .icon-circle': {
            top: isMobile ? '-3vw' : '-4px',
            left: isMobile ? '-3vw' : '-4px',
            zIndex: 10,
            width: isMobile ? '60vw' : '80px',
            height: isMobile ? '60vw' : '80px',
            borderRadius: '50%',
            position: 'absolute',
            boxSizing: 'content-box',
            border: isMobile ? '3vw solid rgba(76, 175, 80, .5)' : '4px solid rgba(76, 175, 80, .5)',
        },
        '& .icon-fix': {
            top: isMobile ? '6vw' : '8px',
            width: isMobile ? '3.75vw' : '5px',
            left: isMobile ? '19.5vw' : '26px',
            zIndex: 1,
            height: isMobile ? '63.75vw' : '85px',
            position: 'absolute',
            transform: 'rotate(-45deg)',
        },
    },
    '@keyframes rotate-circle': {
        '0%': {
            transform: 'rotate(-45deg)',
        },
        '5%': {
            transform: 'rotate(-45deg)',
        },
        '12%': {
            transform: 'rotate(-405deg)',
        },
        '100%': {
            transform: 'rotate(-405deg)',
        },
    },
    '@keyframes icon-line-tip': {
        '0%': {
            width: '0',
            left: isMobile ? '0.75vw' : '1px',
            top: isMobile ? '14.25vw' : '19px',
        },
        '54%': {
            width: '0',
            left: isMobile ? '0.75vw' : '1px',
            top: isMobile ? '14.25vw' : '19px',
        },
        '70%': {
            width: isMobile ? '37.5vw' : '50px',
            left: isMobile ? '-6vw' : '-8px',
            top: isMobile ? '27.75vw' : '37px',
        },
        '84%': {
            width: isMobile ? '12.75vw' : '17px',
            left: isMobile ? '15.75vw' : '21px',
            top: isMobile ? '36vw' : '48px',
        },
        '100%': {
            width: isMobile ? '18.75vw' : '25px',
            left: isMobile ? '10.5vw' : '14px',
            top: isMobile ? '33.75vw' : '45px',
        },
    },
    '@keyframes icon-line-long': {
        '0%': {
            width: '0',
            right: isMobile ? '34.5vw' : '46px',
            top: isMobile ? '40.5vw' : '54px',
        },
        '65%': {
            width: '0',
            right: isMobile ? '34.5vw' : '46px',
            top: isMobile ? '40.5vw' : '54px',
        },
        '84%': {
            width: isMobile ? '41.25vw' : '55px',
            right: '0',
            top: isMobile ? '26.25vw' : '35px',
        },
        '100%': {
            width: isMobile ? '35.25vw' : '47px',
            right: isMobile ? '6vw' : '8px',
            top: isMobile ? '28.5vw' : '38px',
        },
    },
}));

const SuccessCheckmark = () => {
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    return (
        <SuccessCheckmarkContainer isMobile={isMobile}>
            <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
            </div>
        </SuccessCheckmarkContainer>
    );
};

export default SuccessCheckmark; 