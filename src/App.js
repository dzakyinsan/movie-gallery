import Axios from "axios";
import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Input, DatePicker, Modal, Space } from "antd";
import moment from "moment";
import { SearchOutlined, ScheduleOutlined, LikeOutlined } from "@ant-design/icons";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./App.css";
import "antd/dist/antd.css";

function App() {
  const url = "https://5f50ca542b5a260016e8bfb0.mockapi.io/api/v1/movies";
  const [data, setData] = useState([]);
  const [dataDetail, setDataDetail] = useState([]);
  const [search, setSearch] = useState("");
  const [modalDetail, setModalDetail] = useState(null);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filteredImage, setFilteredImage] = useState([]);

  const { RangePicker } = DatePicker;

  const getData = () => {
    Axios.get(url).then((res) => {
      setData(res.data);
    });
  };

  const toggleModal = (val) => {
    setModalDetail(!modalDetail);
    setDataDetail(val);
  };

  const renderModalDetail = () => {
    return (
      <div style={{ position: "relative" }}>
        <img src={dataDetail.image} alt={dataDetail.title} width="100%" height="100%" />
        <div className="detail-desc pl-2">
          <h2>{dataDetail.title}</h2>
          <div className="d-flex">
            <p>
              <ScheduleOutlined />
            </p>
            <p className="schedule">{moment(dataDetail.showTime).format("MMMM Do YYYY, h:mm:ss a")}</p>
          </div>
          <div className="d-flex">
            <p>
              <LikeOutlined />
            </p>
            <p className="schedule">{dataDetail.like}</p>
          </div>
        </div>
      </div>
    );
  };

  const handleCancel = () => {
    setModalDetail(false);
  };

  const onChangeDate = (date, dateString) => {
    if (dateString[0] === "") {
      setStartDate(moment("2019-01-01").format("YYYY-MM-DD"));
      setEndDate(moment("2020-12-01").format("YYYY-MM-DD"));
    } else {
      setStartDate(dateString[0]);
      setEndDate(dateString[1]);
    }
  };

  useEffect(() => {
    getData();
    document.body.classList.add("body");
  }, []);

  useEffect(() => {
    setFilteredImage(data.filter((val) => val.title.toLowerCase().includes(search.toLowerCase())));
  }, [search, data]);

  useEffect(() => {
    setFilteredImage(data.filter((val) => moment(val.showTime).format("YYYY-MM-DD") >= startDate && moment(val.showTime).format("YYYY-MM-DD") <= endDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  return (
    <div className="row main-container">
      <div className="navbar-container">
        <div className="row pt-3">
          <div className="col-6"></div>
          <div className="d-flex justify-content-end col-6 pt-3">
            <Space direction="hirozontal">
              <RangePicker className="rangepicker" onChange={onChangeDate} />
              <Input placeholder="input movie title" bordered={false} suffix={<SearchOutlined style={{ color: "white" }} />} onChange={(e) => setSearch(e.target.value)} />
            </Space>
          </div>
        </div>
      </div>

      {filteredImage?.map((val) => (
        <div className="image col-md-4 col-sm-6" key={val.id} onClick={() => toggleModal(val)}>
          <div id="zoom-In">
            <figure>
              <LazyLoadImage src={val.image} alt={val.title} effect="blur" delayTime={1000} />
              <div className="overlay">
                <div className="title">
                  <h2>{val.title}</h2>
                </div>
              </div>
            </figure>
          </div>
        </div>
      ))}
      <Modal title="Movie Detail" className="modal-detail" visible={modalDetail} footer={null} onOk={handleCancel} onCancel={handleCancel}>
        {renderModalDetail()}
      </Modal>
    </div>
  );
}

export default App;
