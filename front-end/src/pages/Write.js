import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router'
import styled from 'styled-components'
import { LoginContext } from '../App'
import Button from '../components/elements/Button'
import Input from '../components/elements/Input'
import CategoryCard from '../components/write/elements/CategoryCard'
import Icon from '../components/elements/Icon'
import axios from 'axios'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 150px;
  & > h2 {
    font-size: 40px;
    font-weight: bold;
  }
`;

const Form = styled.div`
  width: 100%;
  max-width: 1024px;
    & > * {
        margin-top: 48px;
    }
    & > *:last-child {
        margin-bottom: 64px;
    }
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props => props.width || '100%'};
  & > * + * {
    margin-top: 16px;
  }
  & > label {
    font-size: 20px;
  }
`
const CategoryCardContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  & > * + * {
    margin-left: 16px;
  }
`

const RecipeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  & > * + * {
    margin-top: 16px;
  }
`

const Element = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  & > * + * {
    margin-left: 16px;
  }
`

const Index = styled.div`
  font-size: 24px;
`

const AddButtonContainer = styled.div`
  width: 100%;
  text-align: center;
`

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
`


const ImageInput = styled.input``

const Write = () => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [recipe, setRecipe] = useState([''])
  const [FYI, setFYI] = useState('')
  const [image, setImage] = useState(null)
  const [imagePath, setImagePath] = useState(null)

  const { ID } = useContext(LoginContext)
  const navigate = useNavigate()
  useEffect(() => {
    if (!ID) {
      alert('????????? ??? ?????? ???????????????.')
      navigate('/')
    }
  }, [])

  const onSubmit = async (e) => {
      e.preventDefault()
      if (name.length === 0 || category.length === 0 || recipe.some(e => e.length === 0)) {
        alert('?????? ????????? ???????????? ???????????????.')
      } else {
        if (image) {
          const formData = new FormData()
          formData.append('file', image)
          const { data: imgRes } = await axios.post('/image', formData)
          if (!imgRes) {
            alert('?????? ???????????? ????????? ??????????????????.')
            return
          }
          const { data } = await axios.post('/recipe', {
            title: name,
            id: ID,
            category: category,
            post_fyi: FYI + '\\img' + imgRes.imagePath,
            content: recipe.join('\r\n')
          })
        } else {
          const { data } = await axios.post('/recipe', {
            title: name,
            id: ID,
            category: category,
            post_fyi: FYI,
            content: recipe.join('\r\n')
          })
        }
        alert('?????????????????????.')
        navigate('/')
      }
  };
  
  const handleRecipe = (value, index) => {
    setRecipe(prev => ([
        ...prev.slice(0, index),
        value,
        ...prev.slice(index + 1)
      ]
    ))
  }

  const deleteRecipe = index => {
    if (recipe.length !== 1) {
      setRecipe(prev => ([
        ...prev.slice(0, index),
        ...prev.slice(index + 1)
      ]))
    }
  }

  const handleImage = e => {
    setImage(e.target.files[0])
    setImagePath(URL.createObjectURL(e.target.files[0]))
  }

  return (
    <Container>
      <h2>????????? ??????</h2>
      <Form>
        <InputContainer>
          <label>????????? ??????</label>
          <Input value={name} placeholder="???: ??????" onChange={e => setName(e.target.value)} />
        </InputContainer>
        <InputContainer>
          <label>????????????</label>
          <CategoryCardContainer>
            <CategoryCard active={category === 1} color="yellow" category={1} setCategory={setCategory}>
              <Icon src="/icon-toast.svg" background="yellow" />
              <h4>??? ?? ?????????</h4>
            </CategoryCard>
            <CategoryCard active={category === 2} color="orange" category={2} setCategory={setCategory}>
              <Icon src="/icon-cookie.svg" background="orange" />
              <h4>?????? ?? ??????</h4>
            </CategoryCard>
            <CategoryCard active={category === 3} color="green" category={3} setCategory={setCategory}>
              <Icon src="/icon-carrot.svg" background="green" />
              <h4>?????? ?? ?????????</h4>
            </CategoryCard>
          </CategoryCardContainer>
          <CategoryCardContainer>
            <CategoryCard active={category === 4} color="blue" category={4} setCategory={setCategory}>
              <Icon src="/icon-fridge.svg" background="blue" />
              <h4>?????? ?? ??????</h4>
            </CategoryCard>
            <CategoryCard active={category === 5} color="red" category={5} setCategory={setCategory}>
              <Icon src="/icon-steak.svg" background="red" />
              <h4>?????? ?? ??????</h4>
            </CategoryCard>
            <CategoryCard active={category === 6} color="pink" category={6} setCategory={setCategory}>
              <Icon src="/icon-chicken.svg" background="pink" />
              <h4>??? ?? ?????????</h4>
            </CategoryCard>
          </CategoryCardContainer>
        </InputContainer>
        <InputContainer>
          <label>?????????</label>
          <RecipeContainer>
            {recipe.map((element, index) => (
              <Element>
                <Index>{index + 1}.</Index>
                <Input value={element} placeholder="???: 160?????? 10?????? ??????????????????." onChange={e => handleRecipe(e.target.value, index)} />
                <Button width='80px' onClick={() => deleteRecipe(index)}>??????</Button>
              </Element>
            ))}
          </RecipeContainer>
          <AddButtonContainer>
            <Button width='160px' onClick={() => setRecipe(prev => [...prev, ''])}>??????</Button>
          </AddButtonContainer>
        </InputContainer>
        <InputContainer>
          <label>?????? ??? ?????????</label>
          {imagePath && (<ImageContainer>
              <img alt=' ' src={imagePath} width='400px' />
            </ImageContainer>)}
          <Element>
            <Input value={FYI} placeholder="???: ???????????? ???????????????!" onChange={e => setFYI(e.target.value)} />
            <ImageInput type='file' name='?????? ??????' onChange={e => handleImage(e)} />
          </Element>
        </InputContainer>
        <Button htmlType="submit" background={true ? 'brown' : 'headerbrown'} onClick={onSubmit}>????????????</Button>
      </Form>
    </Container>
  );
}

export default Write;