import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Box, Typography, IconButton } from '@material-ui/core';
import PanelItem from './PanelItem';
import { updateTopics } from '../../../redux/actions/authActions';

const useStyle = makeStyles((theme) => ({
  container: {
    maxWidth: '230px',
    borderRight: `1px solid ${theme.palette.grey[300]}`,
    borderLeft: `1px solid ${theme.palette.grey[300]}`,
    width: '17.96875%',
    height: '100vh',
    paddingTop: '64px',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  searchBar: {
    height: '37px',
    width: '100%',
    borderRadius: '7px',
  },
  searchContainer: {
    minWidth: '193px',
    maxWidth: '193px',
  },
  topicBox: {
    padding: '15px 19px 27px',
  },
  titleBox: {
    padding: '12px 0px 0px',
  },
  title: {
    fontSize: '1.125rem',
    textAlign: 'center',
  },
}));

function Panel(props) {
  const { type, collection } = props;
  const [topic, setTopic] = useState('');
  const classes = useStyle();
  const dispatch = useDispatch();

  const title = (
    <Box component='header' classes={{ root: classes.titleBox }}>
      <Typography classes={{ root: classes.title }}>{type}</Typography>
    </Box>
  );

  const handleAddTopic = (e) => {
    e.preventDefault();

    //prevent adding blank spaces as a topic
    if (topic.trim()) dispatch(updateTopics(topic));

    setTopic('');
  };

  const addTopic = (
    <Box aria-label='Add Topic' classes={{ root: classes.topicBox }}>
      {type === 'Topics' ? (
        <TextField
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              event.target.nextElementSibling.click();
            }
          }}
          fullWidth
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
          }}
          placeholder='Add topic...'
          variant='outlined'
          InputProps={{
            classes: { root: classes.searchBar },
            endAdornment: (
              <IconButton size='small' onClick={handleAddTopic}>
                <i className='fas fa-plus-circle'></i>
              </IconButton>
            ),
          }}
        />
      ) : null}
    </Box>
  );

  //Change key from index
  const items = (
    <Box>
      {collection.map((item, index) => (
        <PanelItem key={index} type={type} text={item} />
      ))}
    </Box>
  );

  return (
    <Box component='section' classes={{ root: classes.container }}>
      {title}
      {addTopic}
      {items}
    </Box>
  );
}

Panel.propTypes = {
  type: PropTypes.string.isRequired,
  collection: PropTypes.array.isRequired,
};

export default Panel;
